var AWS = require('aws-sdk');
var config = require('./config');


// configure the aws sdk
AWS.config.update(
    {
        accessKeyId: config.AWS.ACCESSKEY,
        secretAccessKey: config.AWS.SECRETKEY,
        region: 'us-east-1'
    }
);


// aws services declarations
var ec2 = new AWS.EC2();
var elb = new AWS.ELB();
var s3 = new AWS.S3();
var rds = new AWS.RDS();
var elasticache = new AWS.ElastiCache();
var route53 = new AWS.Route53();

// query the aws api and expose methods for jobs
module.exports = {

    /// EC2 ///

    getEC2InstanceLimit: function (next) {
        ec2.describeAccountAttributes(function(err, data){
            if (err) return next(err, null);
            data.AccountAttributes.forEach(function(attr){
                if (attr.AttributeName === "max-instances") {
                    next(null, attr.AttributeValues[0].AttributeValue);
                }
            });
        });
    },

    getEC2Instances: function (next){
        ec2.describeInstances(function(err, data){
            if (err) return next(err, null);
            next(null, data.Reservations);
        });
    },

    getElasticIPsLimit: function (next) {
        ec2.describeAccountAttributes(function(err, data){
            if (err) return next(err, null);
            data.AccountAttributes.forEach(function(attr){
                if (attr.AttributeName === "max-elastic-ips") {
                    next(null, attr.AttributeValues[0].AttributeValue);
                }
            });
        });
    },

    getElasticIPs: function (next) {
        ec2.describeAddresses(function(err, data) {
            if (err) return next(err, null);
            next(null, data.Addresses);
        });
    },

    getSecurityGroups: function (next) {
        ec2.describeSecurityGroups(function(err, data) {
            if (err) return next(err, null);
            next(null, data.SecurityGroups);
        });
    },

    /// ELB ///

    getELBs: function (next) {
        elb.describeLoadBalancers(function(err, data) {
            if (err) return next(err, null);
            next(null, data.LoadBalancerDescriptions);
        });
    },

    /// S3 ///

    getS3Buckets: function (next) {
        s3.listBuckets(function(err, data) {
            if (err) return next(err, null);
            next(null, data.Buckets);
        });
    },

    //todo: getS3Objects(buceckId, next)

    /// RDS ///

    getRDSInstances: function (next) {
        rds.describeDBInstances(function(err, data) {
            if (err) return next(err, null);
            next(null, data.DBInstances);
        });
    },

    /// ElastiCache ///

    getElastiCacheClusters: function (next) {
        elasticache.describeCacheClusters(function (err, data) {
            if (err) return next(err, null);
            next(null, data.CacheClusters);
        });
    },

    getElastiCacheNodes: function (next) {
        elasticache.describeReservedCacheNodes(function(err, data) {
            if (err) return next(err, null);
            next(null, data.ReservedCacheNodes);
        });
    },

    getElastiCacheSecurityGroups: function (next) {
        elasticache.describeCacheSecurityGroups(function (err, data) {
            if (err) return next(err, null);
            next(null, data.CacheSecurityGroups);
        });
    },

    /// R53 ///

    getR53HostedZones: function (next) {
        route53.listHostedZones(function(err, data) {
            if (err) return next(err, null);
            next(null, data.HostedZones);
        });
    },

    getR53RecordsSet: function (hosted_zones_id, next) {
        route53.listResourceRecordSets({HostedZoneId: hosted_zones_id}, function (err, data){
            if (err) return next(err, null);
            next(null, data.ResourceRecordSets);
        });
    }
}

/*

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
*/
