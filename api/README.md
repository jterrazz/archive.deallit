# deallit-server

> A marketplace focused on decentralization

## Requirements
- MySQL - on AWS Aurora
- Redis
- ZeroMQ
- Bitcoind (bitcoin-core)
- Nginx

Services
- DNS on namecheap / cloudflare
- SSL on namecheap
- AWS S3, EC2, Lambda, RDS
- Mail on sendgrid

## Build Setup

``` bash
# Install dependencies
npm install
npm run install # global dependencies

# Commands for production
npm run prod
npm run pm2-prod # cluster-mode

# Commands for development
npm run dev
npm run pm2-dev # cluster-mode
npm run export # exports categories JSON

# Commands for testing
npm run test

# Usefull commands
npm-check # update dependencies

```
