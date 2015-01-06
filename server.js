var dashing = require('dashing-js').Dashing();

//we can get the express app -> todo: rest api to get dashboards data
var app = dashing.app
app.get('/api/test', function(req, res) {
    res.send("Hello API");
});

// Set your auth token here
//dashing.auth_token = 'YOUR_AUTH_TOKEN';

/*
 dashing.protected = function(req, res, next) {
 // Put any authentication code you want in here.
 // This method is run before accessing any resource.
 // if (true) next();
 }
 */

// Set your default dashboard here
dashing.default_dashboard = 'awstv';

dashing.start();


var aws_job = require('./jobs/aws.jobs');
