var express = require('express');
// var routes = require('./routes');
// var user = require('./routes/user');
var errorhandler = require('errorhandler')
var http = require('http');
var path = require('path');
var models = require("./models");
var app = express();
// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// app.use(express.favicon());
// app.use(express.logger('dev'));
// app.use(express.bodyParser());
// app.use(express.methodOverride());
// app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(errorhandler());
}

// models.Admin.create({
//   username: "Chris",
//   password: "cayman"
// })

// models.Question.create({
//   question: "What is your favorite food?",
//   AdminId: 1
// })
// models.Choice.create({
//   QuestionId: 1,
//   AdminId: 1,
//   choice: "Sushi"
// })
// models.Choice.create({
//   QuestionId: 1,
//   AdminId: 1,
//   choice: "Pizza"
// })

models.Question.findAll({
  where: {
    AdminId: 1
  },
  include: [
    {model: models.Choice}
  ]
}).then(function(fetched) {
  console.log('THIS ADMIN WAS FETCH', fetched[0].Choices)
})

models.sequelize.sync().then(function() {
 var server = app.listen(app.get('port'), function() {
 console.log('Express server listening on port ' + server.address().port);
 });
});
