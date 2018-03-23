# Instructions

### Docker development commands
``` bash
# Start
docker-compose up

# Stop
docker-compose down

# Clean images
docker rmi $(docker images -qa)
```

### Docker production commands
##### Build
``` bash
sh build-prod.sh
# or
sh build-prod.sh api
```

##### Deploy
``` bash
# Start
docker swarm init # --listen-addr $(docker-machine ip node-1):2377
docker stack deploy -c docker-compose.yml --with-registry-auth STACK_NAME

# Stop
docker stack rm STACK_NAME
docker swarm leave --force

docker service ls
docker service ps SERVICE_NAME
docker service scale SERVICE_NAME=5

docker node ls # on swarm host

# Manage
eval $(docker-machine env MANAGER_NODE) # be the manager
docker-machine create --driver none --url=tcp://50.134.234.20:2376 CUSTOM_HW

# Tests (virtual machine requires Oracle VirtualBox)
docker-machine create --driver virtualbox master/worker-1
docker-machine ssh myvm1 "docker swarm init --advertise-addr <myvm1 ip>"

export DOCKER_ID_USER=mmmm
```

> Visualizer
```
docker service create \
	--name=viz \
	--publish=9999:8080 \
	--constraint=node.role==manager \
	--mount=type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock \
	dockersamples/visualizer
```
