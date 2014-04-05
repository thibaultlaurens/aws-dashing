var base = {
    ENV: process.env.NODE_ENV || 'development',
    JOB_INTERVAL:"* * * * * *",
    AWS: {
        ACCESSKEY: "lalalalala",
        SECRETKEY: "lalalalala"
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