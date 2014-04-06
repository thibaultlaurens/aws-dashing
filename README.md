aws-dashing
===========

AWS dashboard powered by Dashing-js, Redis & Node.js


### Getting started

- instal Node.js (later: + redis + run redis-server somewhere)
- turn config.ex.js into config.js + replace default values
- "node server.js" in your terminal
- go and check the dashboard at http://localhost:3030


### Supported components:
- EC2 instance
- Elastic Load Balancer
- Security Group
- S3 Bucket
- Elastic IP


### Notes

- JOB_REFRESH property needs 'cron' like syntax
- Values for 'data-max' property of Meters widget:
    - EC2 instances: API call
    - Load Balancers: 20
    - Elastic IPs: API call


### TODO

- 1) ~~config.js (redis_url, job_interval, aws_account)~~
- 2) ~~aws.jobs.js query aws and emit event for dashing~~
- 3) cron job for aws.job.js
- 4) design aws.jade and awstv.jade
- 5) store aws in redis, aws.jobs.js write to redis

#### Other default values to implement:
- RDS: 40
- R53
    - Hosted zones: 500
    - Records: 10,000 / HZ
- EC:
    - Nodes: 20
    - SG: NC


### NEXT

- play with pricing API
- handle redis connection drop + add opt redis auth
- api.js -> read redis and send json info to browser at /api/ec2, /api/ etc.
- change the job_interval in the UI
