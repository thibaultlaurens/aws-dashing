var base = {
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

var dev = {
    DB: {
        PORT:"6379",
        HOST:"localhost"
    }
}

var prod = {
    DB: {
        PORT:"",
        HOST:""
    }
}

var mergeConfig = function(config){
    for (var attrname in config) {
        base[attrname] = config[attrname];
    }
    return base;
}

module.exports = (function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return mergeConfig(dev);
        case 'production':
            return mergeConfig(prod);
        default:
            return mergeConfig(dev);
    }
}())