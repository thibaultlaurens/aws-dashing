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

ec2.describeAccountAttributes(function(err, data){
    if (err) console.log(err);
    else {
        data.AccountAttributes.forEach(function(attr){
            if (attr.AttributeName === "max-instances") {
                console.log("max ec2: "+ attr.AttributeValues[0].AttributeValue);

                ec2.describeInstances(function(err, data){
                    if (err) console.log(err);
                    else console.log("nodes: " + data.Reservations.length);
                    send_event('ec2', {value: data.Reservations.length, max: attr.AttributeValues[0].AttributeValue});
                });

            }
            if (attr.AttributeName === "max-elastic-ips") {
                console.log("max eip: "+ attr.AttributeValues[0].AttributeValue);

                ec2.describeAddresses(function(err, data) {
                    if (err) console.log(err, err.stack);
                    else console.log("eip: " + data.Addresses.length);
                    send_event('eip', {value: data.Addresses.length, max: attr.AttributeValues[0].AttributeValue});
                });
            }

        })
    }
});

ec2.describeSecurityGroups(function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log("sg: " + data.SecurityGroups.length);
    send_event('sg', {text: data.SecurityGroups.length })
});



elb.describeLoadBalancers(function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log("elb: " + data.LoadBalancerDescriptions.length);
    send_event('elb', {value: data.LoadBalancerDescriptions.length })
});

s3.listBuckets(function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log("s3 buckets: " + data.Buckets.length);
    send_event('s3', {text: data.Buckets.length })
});

send_event('summary', { items: [
        { label:"EC2 instances", value:"15" },
        { label:"Elastic IPs", value:"2" },
        { label:"Elastic Load Balancers", value:"3" },
        { label:"S3 Buckets", value:"1" },
        { label:"Security Groups", value:"32" }
    ] })

//todo limits api
//todo pricing api

