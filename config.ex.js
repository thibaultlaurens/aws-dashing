module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    JOB_INTERVAL: "*/30 * * * * *",
    LONG_JOB_INTERVAL:  "0 */30 * * * *",
    DAILY_JOB_INTERVAL: "0 0 00 * * *",
    AWS: {
        ACCESSKEY: "lalalalala",
        SECRETKEY: "lalalalala",
        REGION: "us-east-1"
    },
    AWS_LIMITS: {
        RDS: "40",
        ELB: "80",
        ELASTICACHEINSTANCE: "20"
    }
}
