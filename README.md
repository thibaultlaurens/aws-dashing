aws-dashing
===========

AWS dashboard powered by Dashing-js, Redis & Node.js


### Getting started

- instal Node.js (later: + redis + run redis-server somewhere)
- turn config.ex.js into config.js + replace default values (JOB_REFRESH property needs 'cron' like syntax)
- "node server.js" in your terminal
- go and check the dashboard at http://localhost:3030



### TODO

- 1) <s>config.js (redis_url, job_interval, aws_account)</s>
- 2) aws.jobs.js query aws and emit event for dashing
- 3) design aws.jade and awstv.jade
- 4) store aws in redis, aws.jobs.js write to redis


### NEXT

- handle redis connection drop + add opt redis auth
- api.js -> read redis and send json info to browser at /api/ec2, /api/ etc.
- change the job_interval in the UI
