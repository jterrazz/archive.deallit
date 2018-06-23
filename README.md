# Project

!!! Due to my AWS Account being closed,
Most CDN related functionalities are not currently working

Structure :
- **api** : API written in NodeJS
- **client-web** : VueJS Web client
- **db: MySQL** database for development and production
- **setup** : Instructions for AWS

This project contains fake passwords, fake API keys, and empty Bitcoin addresses

``` bash
# Start with
docker-compose up # -d for daemon

# Access website on localhost:8080
# Default credentials :
# mail: test2@test.com
# pwd: test
```

# Technologies

**Docker** for development and production

**Server**
- Node.js
- MySQL (Aurora on AWS)
- Redis
- ZeroMQ (bitcoin-core events)
- Bitcoind (bitcoin-core)

**Client**
- VueJS
- Less
- Webpack

**Services**
- AWS : S3, EC2, Lambda, RDS, ELB, Cloudfront, WAF
- Sendgrid : mail API
- DNS : namecheap + cloudflare
- SSL : namecheap or letsencrypt

**Tests**
- Mocha

---
# Usefull commands
### Docker development commands
``` bash
# Will start everything
docker-compose up -d

# Use commands
docker-compose stop
docker-compose start # npm install

docker logs -f CONTAINER_ID # show logs
docker attach CONTAINER_ID # --sig-proxy=false to allow ctrl-c
docker exec -it CONTAINER_ID "..." # /bin/sh to start new terminal

# Clean
docker-compose down

docker rm $(docker ps -aq)
docker rmi $(docker images -qa)

# Commands for testing
npm run test # in api folder
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

# TODO

-
- Find app for todo tasks
- Remove temp bitcoin
- Inscription mail
- 2ID Page
- Notifications
- Store Page
- Manage follows
- Home UX
- Search UX
- Dashboard UX
- Ratings
- Address system
- Go through order -> payment type -> Accept
