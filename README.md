# Technologies

**Server**
- Node.js
- MySQL (Aurora on AWS)
- Redis
- ZeroMQ
- Bitcoind (bitcoin-core)

**Client**
- VueJS

**Services**
- *AWS:* S3, EC2, Lambda, RDS, ELB, Cloudfront
- Sendgrid: mail API
- DNS: namecheap + cloudflare
- SSL: namecheap

---
# Instructions
### Docker development commands
``` bash
# Build: will download and logs everything
docker-compose up -d
docker-compose stop
docker-compose start # npm install

docker logs -f CONTAINER_ID # follow logs
docker attach CONTAINER_ID # --sig-proxy=false to ctrl c
docker exec -it CONTAINER_ID "..." # /bin/sh to start new terminal

# Clean
docker-compose down

docker rm $(docker ps -aq)
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
