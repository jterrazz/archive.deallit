# Instructions

**Technologies**
- Node.js
- MySQL (Aurora on AWS)
- Redis
- ZeroMQ
- Bitcoind (bitcoin-core)

**Services**
- *VueJS client:* [github](https://github.com/Maestru2a/deallit-client)
- *AWS:* S3, EC2, Lambda, RDS, ELB, Cloudfront
- Sendgrid: mail API
- DNS: namecheap + cloudflare
- SSL: namecheap

---

### Docker development commands
``` bash
docker-compose up # Build
docker-compose start
docker-compose stop
docker-compose down # Destroy

# Clean images
docker rmi $(docker images -qa)
```

### Docker production commands
**Build**
``` bash
sh build-prod.sh
# or
sh build-prod.sh api
```

**Deploy**
``` bash
# Start
docker swarm init # --listen-addr $(docker-machine ip node-1):2377
docker stack deploy -c docker-compose-prod.yml --with-registry-auth STACK_NAME

# Stop
docker stack rm STACK_NAME
docker swarm leave --force

docker service ls
docker service ps SERVICE_NAME
docker service scale SERVICE_NAME=5

docker node ls # on swarm host

# Manage
docker-machine create --driver none --url=tcp://50.134.234.20:2376 CUSTOM_HW

# Tests (virtual machine requires Oracle VirtualBox)
docker-machine create --driver virtualbox master/worker-1
docker-machine ssh myvm1 "docker swarm init --advertise-addr <myvm1 ip>"

eval $(docker-machine env MANAGER_NODE) # be the manager
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
