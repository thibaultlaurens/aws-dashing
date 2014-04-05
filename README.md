aws-dashing
===========

aws-dashing is a dashboard for aws using dashing-js

//TODO
- api.js -> read redis and send json info to browser at /api/...
- config.js -> redis_url + interval for job + aws account
- aws.jobs.js ... -> query aws, store in redis, emit event for dashing
