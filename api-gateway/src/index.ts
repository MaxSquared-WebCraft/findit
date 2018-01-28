import * as monitor from 'node-docker-monitor';
import * as http from 'http';
import * as httpProxy from 'http-proxy';
import * as parseurl from 'parseurl';
import * as jwt from 'jsonwebtoken';

// process input via env vars
const dockerOpts: any = { socketPath: process.env.DOCKER_SOCKET };
if (!dockerOpts.socketPath) {
  dockerOpts.host = process.env.DOCKER_HOST;
  dockerOpts.port = process.env.DOCKER_PORT;
  if (!dockerOpts.host) {
    dockerOpts.socketPath = '/var/run/docker.sock';
  }
}

const httpPort = process.env.HTTP_HOST || 8080;
let routes = {};

console.log('Connecting to Docker: %j', dockerOpts);

monitor({
  onContainerUp(containerInfo, docker) {
    if (containerInfo.Labels && containerInfo.Labels.api_routes) {
      const container = docker.getContainer(containerInfo.Id);
      container.inspect((err, containerDetails) => {
        if (err) {
          console.log('Error getting container details for: %j', containerInfo, err);
        } else {
          try {
            for (let route of containerInfo.Labels.api_routes.split(';')) {
              routes[route] = {
                route,
                url: getUpstreamUrl(containerDetails),
                secure: containerInfo.Labels.secure === 'yes'
              };
              console.log('Registered new api route: %s --> %s', route, getUpstreamUrl(containerDetails));
            }
          } catch (e) {
            console.log('Error creating new api route for: %j', containerDetails, e);
          }
        }
      });
    }
  },

  onContainerDown(container) {
    if (container.Labels && container.Labels.api_routes) {
      // remove existing route when container goes down
      for (let r of container.Labels.api_routes.split(';')) {
        const route = routes[r];
        if (route) {
          delete routes[r];
          console.log('Removed api route: %j', r);
        }
      }
    }
  }
}, dockerOpts);

// create and start http server
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  for (const id in routes) {
    if (handleRoute(routes[id], req, res)) {
      return;
    }
  }

  returnError(req, res);
});

console.log('API gateway is listening on port: %d', httpPort);
server.listen(httpPort);

// create proxy
const proxy = httpProxy.createProxyServer();
proxy.on('error', (err, req, res) => {
  console.log('error', err);
  returnError(req, res);
});

// proxy HTTP request / response to / from destination upstream service if route matches
function handleRoute(route, req, res): boolean {

  const parsedUrl = parseurl(req);
  const authToken = req.headers.authorization;
  let decoded = null;

  if (authToken) {
    // decode token of available
    try {
      decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    } catch (err) {
      return false;
    }

    console.log(decoded); // bar
    // set token for role and userid
    req.headers['x-user'] = decoded.uuid;
    req.headers['userId'] = decoded.uuid;
    req.headers['x-role'] = decoded.role;
  }

  console.log(`matching ${parsedUrl.path} with`, route);

  if (parsedUrl.path.indexOf(route.route) === 0) {

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Access-Control-Request-Method', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    }

    console.log(`Matched! routing ${req.method} request to: ` + route.url);

    if (route.secure && !decoded && req.method !== 'OPTIONS') {
      return false;
    }

    proxy.web(req, res, { target: route.url });
    return true;
  }
  return false;
}

// generate upstream url from containerDetails
function getUpstreamUrl(containerDetails) {
  const ports = containerDetails.NetworkSettings.Ports;
  for (const id in ports) {
    if (ports.hasOwnProperty(id)) {
      return 'http://' +
        containerDetails.NetworkSettings.Networks['findit_be-network'].IPAddress + ':' + id.split('/')[0];
    }
  }
}

// send 502 response to the client in case of an error
function returnError(req, res) {
  res.writeHead(502, { 'Content-Type': 'application/json' });
  res.write('Bad Gateway for: ' + req.url);
  res.end();
}
