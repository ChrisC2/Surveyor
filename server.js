var Sequelize = require("sequelize");
var models = require('./models');
var express = require('express');
var app = express();
var bcrypt = require('bcrypt-nodejs');

var hash = bcrypt.hashSync('bacon')

var hello = bcrypt.compareSync("bacon", hash)
console.log(hello)

//Configures server with all middleware & routing
require('./config/middleware.js')(app, express);

models.sequelize.sync().then(function() {
 var server = app.listen(app.get('port'), function() {
 console.log('Express server listening on port ' + server.address().port);
 });
});
