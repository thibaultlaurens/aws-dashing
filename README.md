aws-dashing
===========

AWS dashboard powered by Dashing-js, Redis & Node.js

//WORK IN PROGRESS

![alt tag](https://raw.githubusercontent.com/ThibaultLaurens/aws-dashing/master/screenshot.png?token=1448075__eyJzY29wZSI6IlJhd0Jsb2I6VGhpYmF1bHRMYXVyZW5zL2F3cy1kYXNoaW5nL21hc3Rlci9zY3JlZW5zaG90LnBuZyIsImV4cGlyZXMiOjEzOTc0MTY3NzZ9--8184989a8dffcabb54fe484bf041fc9eee6a0231)


### Getting started

- instal Node.js (later: + redis + run redis-server somewhere)
- turn config.ex.js into config.js + replace default values
- "node server.js" in your terminal
- go and check the dashboard at http://localhost:3030


### Supported components:
- EC2 instances
- Elastic Load Balancers
- Security Groups
- S3 Buckets
- Elastic IPs
- ElastiCache (clusters, nodes and security groups)
- Route 53 (hosted zones and record set)
- RDS instances


### Notes

- JOB_REFRESH property needs 'cron' like syntax
- Values for 'data-max' property of Meters widget:
    - EC2 instances: API call
    - Load Balancers: 20
    - Elastic IPs: API call
    - //todo RDS: 40
    - //todo ElastiCache instances: 20


### TODO

- 1) ~~config.js (redis_url, job_interval, aws_account)~~
- 2) ~~aws.jobs.js query aws and emit event for dashing~~
- 3) cron job for aws.job.js
- 4) design aws.jade and awstv.jade
- 5) store aws in redis, aws.jobs.js write to redis


### NEXT

- play with pricing API
- handle redis connection drop + add opt redis auth
- api.js -> read redis and send json info to browser at /api/ec2, /api/ etc.
- change the job_interval in the UI
