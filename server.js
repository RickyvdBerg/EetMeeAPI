var config      = require('./config/config');
var http        = require('http');
var express     = require('express');
var bodyParser 	= require('body-parser');
var db = require('./datasource/mysql-connector.js');

var app = express();

app.set('PORT', CONFIG.port);
app.set('SECRET_KEY', config.secretkey);

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

//
app.all('*', function(req, res, next){
    console.log( req.method + " " + req.url);
    next();
});

// Routing with versions
app.use('/api', require('./routes/routes_api'));

// Start the server
const port = process.env.PORT || app.get('PORT');

app.listen(port, () => {
    console.log('Server started on port: '+ port);
});

module.exports = app;