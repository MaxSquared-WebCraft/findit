import * as monitor from 'node-docker-monitor';
import * as http from 'http';
import * as httpProxy from 'http-proxy';
import * as parseurl from 'parseurl';

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
let routes = {
    // '303c56be38b748576be1598eb9d6a746fb2792c5c9c6d83608ed8f2b5501b063' : {
    //     apiRoute: '/service1',
    //     upstreamUrl: 'http://127.0.0.1:8887'
    // }
};

console.log('Connecting to Docker: %j', dockerOpts);

monitor({
    onContainerUp(containerInfo, docker) {
        if (containerInfo.Labels && containerInfo.Labels.api_route) {
            // register a new route if container has "api_route" label defined
            const container = docker.getContainer(containerInfo.Id);
            // get running container details
            container.inspect((err, containerDetails) => {
                if (err) {
                    console.log('Error getting container details for: %j', containerInfo, err);
                } else {
                    try {
                        // prepare and register a new route
                        const route = {
                            apiRoute: containerInfo.Labels.api_route,
                            upstreamUrl: getUpstreamUrl(containerDetails)
                        };

                        routes[containerInfo.Id] = route;
                        console.log('Registered new api route: %j', route);
                    } catch (e) {
                        console.log('Error creating new api route for: %j', containerDetails, e);
                    }
                }
            });
        }
    },

    onContainerDown(container) {
        if (container.Labels && container.Labels.api_route) {
            // remove existing route when container goes down
            const route = routes[container.Id];
            if (route) {
                delete routes[container.Id];
                console.log('Removed api route: %j', route);
            }
        }
    }
}, dockerOpts);

// create and start http server
const server = http.createServer((req, res) => {
    for (const id in routes) {
        if (routes.hasOwnProperty(id) && handleRoute(routes[id], req, res)) {
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
    returnError(req, res);
});

// proxy HTTP request / response to / from destination upstream service if route matches
function handleRoute(route, req, res) {
    const url = req.url;
    const parsedUrl = parseurl(req);

    if (parsedUrl.path.indexOf(route.apiRoute) === 0) {
        req.url = url.replace(route.apiRoute, '');
        proxy.web(req, res, { target: route.upstreamUrl });
        return true;
    }
}

// generate upstream url from containerDetails
function getUpstreamUrl(containerDetails) {
    const ports = containerDetails.NetworkSettings.Ports;
    for (const id in ports) {
        if (ports.hasOwnProperty(id)) {
            return 'http://' + containerDetails.NetworkSettings.IPAddress + ':' + id.split('/')[0];
        }
    }
}

// send 502 response to the client in case of an error
function returnError(req, res) {
    res.writeHead(502, {'Content-Type': 'text/plain'});
    res.write('Bad Gateway for: ' + req.url);
    res.end();
}
