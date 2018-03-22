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

# AWS Helper
## Image resize on the fly and serverless
##### S3 Bucket
Set public permission

``` JSON
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::deallit-dev/*"
        }
    ]
}
```

- Website hosting -> index.html -> note endpoint

##### Lambda

Create a function with a personnalized role
``` JSON
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::__YOUR_BUCKET_NAME_HERE__/*"
    }
  ]
}
```

- Add API gateway trigger, open security
- Upload the ZIP function
- ENV : BUCKET (name), URL (endpoint cloudfront), ALLOWED_DIMENSIONS (200x200,300x200)
- 1536 mo RAM, 10s delay

Add http rule to the S3 static settings
``` XML
<RoutingRules>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals/>
            <HttpErrorCodeReturnedEquals>404</HttpErrorCodeReturnedEquals>
        </Condition>
        <Redirect>
            <Protocol>https</Protocol>
            <HostName>__YOUR_API_HOSTNAME_HERE__</HostName>
            <ReplaceKeyPrefixWith>__XXX__/__XXX__?key=</ReplaceKeyPrefixWith>
            <HttpRedirectCode>307</HttpRedirectCode>
        </Redirect>
    </RoutingRule>
</RoutingRules>
```
##### Cloudfront
- Set server name to endpoint URL
- Set default cache to 0 for paths *x*.png

# SSL registration
https://blog.alejandrocelaya.com/2016/08/16/setup-a-lets-encrypt-certificate-in-a-aws-elastic-load-balancer/
``` bash
./certbot-auto certonly --agree-tos --manual --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory -d "*.<your host>"

/etc/letsencrypt/live/deallit.com/...

certbot renew
```
