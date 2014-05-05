var async = require('async'),
    CronJob = require('cron').CronJob,
    aws_service = require('../aws.service'),
    config = require("../config"),

    summary = { ec2_instances:0, elastic_ips:0, elbs:0, security_groups:0, s3_buckets:0,
        s3_objects:0, rds_instances:0, ec_clusters:0, ec_nodes:0, ec_security_groups:0,
        r53_hosted_zones:0, r53_records:0, ebs_volumes:0, ebs_snapshots:0 };


// DEFAULT CRON JOB, every x seconds

new CronJob(config.JOB_INTERVAL, function(){

    console.log('running cron job at: ' + new Date());

    // send events for Meter widgets

    aws_service.getEC2InstanceLimit(function(err, limit){
        if (!err) {
            aws_service.getEC2Instances(function(err, ec2_instances){
                if (!err) {
                    var length = ec2_instances.length
                    summary.ec2_instances = length;
                    send_event('ec2', {value: length, max: limit});
                }
            })
        }
    });

    aws_service.getElasticIPsLimit(function(err, limit){
        if (!err) {
            aws_service.getElasticIPs(function(err, elastic_ips){
                if (!err) {
                    var length = elastic_ips.length;
                    summary.elastic_ips = length;
                    send_event('eip', {value: length, max: limit});
                }
            })
        }
    });

    aws_service.getELBs(function(err, elbs){
        if (!err) {
            var length = elbs.length;
            summary.elbs = length;
            send_event('elb', {value: length, max: config.AWS_LIMITS.ELB });
        }
    });

    aws_service.getRDSInstances(function(err, rds_instances){
        if (!err) {
            var length = rds_instances.length;
            summary.rds_instances = length;
            send_event('rds', {value: length, max: config.AWS_LIMITS.RDS });
        }
    });

    aws_service.getElastiCacheNodes(function(err, ec_nodes){
        if (!err) {
            var length = ec_nodes.length
            summary.ec_nodes = length;
            send_event('cache_node', {value: length, max: config.AWS_LIMITS.ELASTICACHEINSTANCE });
        }
    });

    // send events for Text widgets

    aws_service.getSecurityGroups(function(err, security_groups){
        if (!err) {
            var length = security_groups.length;
            summary.security_groups = length;
            send_event('sg', {text: length });
        }
    });

    aws_service.getElastiCacheClusters(function(err, ec_clusters){
       if (!err) {
           var length = ec_clusters.length;
           summary.ec_clusters = length;
           send_event('cache_cluster', {text: length });
       }
    });

    aws_service.getElastiCacheSecurityGroups(function(err, ec_security_groups){
       if (!err) {
           var length = ec_security_groups.length;
           summary.ec_security_groups = length;
           send_event('cache_sg', {text: length });
       }
    });

    aws_service.getR53HostedZones(function(err, r53_hosted_zones){
        if (!err) {
            var length = r53_hosted_zones.length;
            summary.r53_hosted_zones = length;
            send_event('hz', {text: length });
            summary.r53_records = 0;
            r53_hosted_zones.forEach(function (hosted_zone) {
                aws_service.getR53RecordsSet(hosted_zone.Id, function (err, record_sets) {
                 if (!err) {
                     summary.r53_records += record_sets.length;
                     send_event('record', {text: summary.r53_records});
                 }
                });
            });
        }
    });

    aws_service.getS3Buckets(function(err, s3_buckets){
        if (!err) {
            var length = s3_buckets.length;
            summary.s3_buckets = length;
            send_event('s3_buckets', {text: length });
        }
    });

    aws_service.getEBSVolumes(function(err, volumes){
        if (!err) {
            var length = volumes.length;
            summary.ebs_volumes = length;
            send_event('ebs_volumes', {text: length });
        }
    });

    aws_service.getEBSSnapshots(function(err, snapshots){
        if (!err) {
            var length = snapshots.length;
            summary.ebs_snapshots = length;
            send_event('ebs_snapshots', {text: length });
        }
    });

}, null, true, null);


// send events for List widgets every 5 seconds

setInterval(function() {
    send_event('summary', { items: [
        { label:"EC2 instances", value:summary.ec2_instances },
        { label:"Security Groups", value:summary.security_groups },
        { label:"Elastic Load Balancers", value:summary.elbs },
        { label:"Elastic IPs", value:summary.elastic_ips },
        { label:"S3 Buckets", value:summary.s3_buckets },
        { label:"S3 Objects", value:summary.s3_objects },
        { label:"RDS instances", value:summary.rds_instances },
        { label:"R53 zones", value:summary.r53_hosted_zones },
        { label:"R53 records", value:summary.r53_records },
        { label:"ElastiCache clusters", value:summary.ec_clusters },
        { label:"ElastiCache nodes", value:summary.ec_nodes },
        { label:"ElastiCache SG", value:summary.ec_security_groups },
        { label:"EBS Volumes", value:summary.ebs_volumes },
        { label:"EBS Snapshots", value:summary.ebs_snapshots }
    ] })
}, 5 * 1000);


// LONG CRON JOB, every x minutes

var ec2_points = [];
for (var i = 1; i <= 10; i++) {         // init EC2 graph
    ec2_points.push({x: i, y: i});
}
var ec2_last_x = ec2_points[ec2_points.length - 1].x;

new CronJob(config.LONG_JOB_INTERVAL, function(){

    console.log('running long cron job at: ' + new Date());

    aws_service.getEC2Instances(function(err, ec2_instances){
        if (!err) {
            ec2_points.shift();
            ec2_points.push({x: ++ec2_last_x, y: ec2_instances.length});
            send_event('ec2_graph', {points: ec2_points});
        }
    });

}, null, true, null);


// DAILY CRON JOB

new CronJob(config.DAILY_JOB_INTERVAL, function(){

    console.log('running daily cron job at: ' + new Date());

    aws_service.getS3Buckets(function(err, s3_buckets){
        if (!err) {
            summary.s3_objects = 0;
            var s3_objects = 0;
            async.each(s3_buckets, function(bucket, callback){
                aws_service.getS3Objects(bucket.Name, function(err, objects){
                    if (!err) {
                        s3_objects += objects;
                        callback()
                    }
                });
            }, function(err){
                if (!err) {
                    summary.s3_objects = s3_objects;
                    send_event('s3_objects', {text: summary.s3_objects});
                }
            });
        }
    });

}, null, true, null);






