var AWS = require('aws-sdk');
var config = require('../config');

AWS.config.update(
    {
        accessKeyId: config.AWS.ACCESSKEY,
        secretAccessKey: config.AWS.SECRETKEY,
        region: 'us-east-1'
    }
);

var ec2 = new AWS.EC2();
var elb = new AWS.ELB();
var s3 = new AWS.S3();

ec2.describeInstances(function(err, data){
    if (err) console.log(err);
    else console.log("nodes: " + data.Reservations.length);
});


ec2.describeSecurityGroups(function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log("sg: " + data.SecurityGroups.length);
});

ec2.describeAddresses(function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log("eip: " + data.Addresses.length);
});

elb.describeLoadBalancers(function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log("elb: " + data.LoadBalancerDescriptions.length);
});

s3.listBuckets(function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log("s3 buckets: " + data.Buckets.length);
});

//todo limits api
//todo pricing api

