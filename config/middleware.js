var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var path = require('path');
var errorhandler = require('errorhandler');
var router = require('./routes.js');
var passport = require('passport');
require('./passport.js')(passport);

module.exports = function(app, express) {

  // all environments
  app.set('port', process.env.PORT || 8000);
  app.use(express.static(path.join(__dirname + '/../client')));

  app.use(bodyParser.urlencoded({extended: true})); // get information from html forms
  app.use(bodyParser.json());
  app.use(cookieParser()); // read cookies (needed for auth)
  app.use(expressSession({
    secret: process.env.SESSION_SECRET || "the secret",
    resave: false,
    saveUninitialized: false
  }))

  //Initialize PassportJS
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/', router);

  // development only
  if ('development' == app.get('env')) {
      app.use(errorhandler());
  }
}
