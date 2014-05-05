module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    JOB_INTERVAL: "*/30 * * * * *",
    LONG_JOB_INTERVAL:  "0 */30 * * * *",
    AWS: {
        ACCESSKEY: "lalalalala",
        SECRETKEY: "lalalalala"
    },
    AWS_LIMITS: {
        RDS: "40",
        ELB: "80",
        ELASTICACHEINSTANCE: "20"
    }
}