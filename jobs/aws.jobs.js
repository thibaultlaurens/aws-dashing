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
var rds = new AWS.RDS();
var elasticache = new AWS.ElastiCache();
var route53 = new AWS.Route53();


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


rds.describeDBInstances(function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('rds: ' + data.DBInstances.length);
    send_event('rds', {text: data.DBInstances.length })
});


elasticache.describeCacheClusters(function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log('cache clusters: ' + data.CacheClusters.length);
    send_event('cache_cluster', {text: data.CacheClusters.length });
});

elasticache.describeCacheSecurityGroups(function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log('cache sg: ' + data.CacheSecurityGroups.length);
    send_event('cache_sg', {text: data.CacheSecurityGroups.length });
});

elasticache.describeReservedCacheNodes(function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log("cache nodes: " + data.ReservedCacheNodes.length);
    send_event('cache_node', {text: data.ReservedCacheNodes.length });
});


route53.listHostedZones(function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('hosted zones: ' + data.HostedZones.length);
    send_event('hz', {current: data.HostedZones.length })

    var records = 0
    data.HostedZones.forEach(function(hz){
        route53.listResourceRecordSets({HostedZoneId: hz.Id}, function (err, data){
            if (err) console.log(err, err.stack);
            else records += data.ResourceRecordSets.length
            send_event('record', {current: records })
        })
    });

});


send_event('summary', { items: [
        { label:"EC2 instances", value:"0" },
        { label:"Security Groups", value:"0" },
        { label:"Elastic Load Balancers", value:"0" },
        { label:"Elastic IPs", value:"0" },
        { label:"S3 Buckets", value:"0" },
        { label:"RDS instances", value:"0" },
        { label:"R53 zones", value:"0" },
        { label:"R53 records", value:"0" },
        { label:"ElastiCache clusters", value:"0" },
        { label:"ElastiCache nodes", value:"0" },
        { label:"ElastiCache SG", value:"0" }
    ] })

