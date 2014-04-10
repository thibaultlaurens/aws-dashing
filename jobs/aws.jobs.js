var CronJob = require('cron').CronJob,
    aws_service = require('../aws.service'),
    config = require("../config"),

    summary = { ec2_instances:0, elastic_ips:0, elbs:0, security_groups:0, s3_buckets:0,
        rds_instances:0, ec_clusters:0, ec_nodes:0, ec_security_groups:0, r53_hosted_zones:0,
        r53_records:0 };

// send events for Meter widgets

new CronJob(config.JOB_INTERVAL, function(){

    console.log('running cron job at: ' + new Date());

    aws_service.getEC2InstanceLimit(function(err, limit){
        if (!err) {
            aws_service.getEC2Instances(function(err, ec2_instances){
                if (!err) {
                    summary.ec2_instances = ec2_instances.length;
                    send_event('ec2', {value: ec2_instances.length, max: limit});
                }
            })
        }
    });

    aws_service.getElasticIPsLimit(function(err, limit){
        if (!err) {
            aws_service.getElasticIPs(function(err, elastic_ips){
                if (!err) {
                    summary.elastic_ips = elastic_ips.length;
                    send_event('eip', {value: elastic_ips.length, max: limit});
                }
            })
        }
    });

    aws_service.getELBs(function(err, elbs){
        if (!err) {
            summary.elbs = elbs.length;
            send_event('elb', {value: elbs.length, max: config.AWS_LIMITS.ELB })
        }
    });

    // send events for Text widgets

    aws_service.getSecurityGroups(function(err, security_groups){
        if (!err) {
            summary.security_groups = security_groups.length;
            send_event('sg', {text: security_groups.length })
        }
    });

    aws_service.getS3Buckets(function(err, s3_buckets){
        if (!err) {
            summary.s3_buckets = s3_buckets.length;
            send_event('s3', {text: s3_buckets.length })
        }
    });

    aws_service.getRDSInstances(function(err, rds_instances){
        if (!err) {
            summary.rds_instances = rds_instances.length;
            send_event('rds', {text: rds_instances.length })
        }
    });

    aws_service.getElastiCacheClusters(function(err, ec_clusters){
       if (!err) {
           summary.ec_clusters = ec_clusters.length;
           send_event('cache_cluster', {text: ec_clusters.length });
       }
    });

    aws_service.getElastiCacheNodes(function(err, ec_nodes){
        if (!err) {
            summary.ec_nodes = ec_nodes.length;
            send_event('cache_node', {text: ec_nodes.length });
        }
    });

    aws_service.getElastiCacheSecurityGroups(function(err, ec_security_groups){
       if (!err) {
           summary.ec_security_groups = ec_security_groups.length;
           send_event('cache_sg', {text: ec_security_groups.length });
       }
    });

    // send events for Number widgets

    aws_service.getR53HostedZones(function(err, r53_hosted_zones){
        if (!err) {
            summary.r53_hosted_zones = r53_hosted_zones.length;
            send_event('hz', {text: r53_hosted_zones.length });

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

}, null, true, null);

// send events for List widgets

setInterval(function() {
    send_event('summary', { items: [
        { label:"EC2 instances", value:summary.ec2_instances },
        { label:"Security Groups", value:summary.security_groups },
        { label:"Elastic Load Balancers", value:summary.elbs },
        { label:"Elastic IPs", value:summary.elastic_ips },
        { label:"S3 Buckets", value:summary.s3_buckets },
        { label:"RDS instances", value:summary.rds_instances },
        { label:"R53 zones", value:summary.r53_hosted_zones },
        { label:"R53 records", value:summary.r53_records },
        { label:"ElastiCache clusters", value:summary.ec_clusters },
        { label:"ElastiCache nodes", value:summary.ec_nodes },
        { label:"ElastiCache SG", value:summary.ec_security_groups }
    ] })
}, 5 * 1000);



