# findIt-Repo

kafka:

'docker run -p 2181:2181 -p 9092:9092 --env ADVERTISED_HOST=localhost --env ADVERTISED_PORT=9092 spotify/kafka'

elastic:

'docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:6.0.0'

mysql:

'docker run -e MYSQL_ROOT_PASSWORD=root_pass --env MYSQL_USER=user --env MYSQL_PASSWORD=password --env MYSQL_DATABASE=findit -p 3306:3306 -d mysql:8.0'