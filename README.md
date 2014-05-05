aws-dashing
===========

AWS dashboard powered by Dashing-js & Node.js

- dashing: "The exceptionally handsome dashboard framework in Ruby and Coffeescript" - https://github.com/Shopify/dashing
- dashing-js: "Port of Dashing to node.js" - https://github.com/fabiocaseri/dashing-js

![alt tag](https://raw.githubusercontent.com/ThibaultLaurens/aws-dashing/master/screenshot.png?token=1448075__eyJzY29wZSI6IlJhd0Jsb2I6VGhpYmF1bHRMYXVyZW5zL2F3cy1kYXNoaW5nL21hc3Rlci9zY3JlZW5zaG90LnBuZyIsImV4cGlyZXMiOjEzOTc0MTY3NzZ9--8184989a8dffcabb54fe484bf041fc9eee6a0231)


### Getting started

- instal Node.js
- turn config.ex.js into config.js & replace default values
- start the server: "node server.js"
- go and check the dashboard at http://localhost:3030


### Supported aws services:
- EC2 instances
- Elastic Load Balancers
- EC2 Security Groups
- S3 Buckets & Objects
- Elastic IPs
- ElastiCache (clusters, nodes and security groups)
- Route 53 (hosted zones and record set)
- RDS instances
- EBS volumes and Snapshots


### Notes

- JOB_REFRESH property needs 'cron' like syntax, the value in config.ex.js will run the cron job every 30 seconds
- Values for 'data-max' property of Meters widget:
    - EC2 instances: API call
    - Load Balancers: 20
    - Elastic IPs: API call
    - RDS: 40
    - ElastiCache instances: 20
