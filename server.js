var express = require('express');
var errorhandler = require('errorhandler');
var http = require('http');
var path = require('path');
var Sequelize = require("sequelize");
var Promise = require('bluebird');
var models = require('./models');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var app = express();
var router = express.Router();
var passport = require('passport');
require('./config/passport.js')(passport);

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname + '/./client')));

app.use(bodyParser.urlencoded({extended: true})); // get information from html forms
app.use(bodyParser.json());
app.use(cookieParser()); // read cookies (needed for auth)
app.use(expressSession({
  secret: process.env.SESSION_SECRET || "the secret",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

//Protect routes by checking if user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    console.log("HES AUTHENTICATED")
    return next();
  } else {
    res.redirect('/');
  }
}

// development only
if ('development' == app.get('env')) {
    app.use(errorhandler());
}

//Get the Admin's Questions and their Answers
router.get('/admin/questions', isAuthenticated, function(req, res) {
  models.Question.findAll({
    where: {
      AdminId: req.user.id
    },
    include: [
      {model: models.Choice},
      {model: models.Answer}
    ]
  }).then(function(questions) {
    console.log('THESE ARE ADMIN QUESTIONS', questions)
    res.json(questions);
  })
})

//Allows Admin to add a Question
router.post('/admin/add', function (req, res) {
  models.Question.create({
    question: req.body.question,
    AdminId: req.user.id
  })
})

//Allows Admin to add Choices to their Question
router.post('/admin/choice/:qid', function (req, res) {
  models.Choice.create({
    QuestionId: req.params.qid,
    AdminId: req.user.id,
    choice: req.body.choice
  })
})

//Helper Function
var selectQuestion = function (count, guestId) {
  //Select random Id to Query
  //Check if that Question Id has already been answered
  var randomNum = Math.floor((Math.random() * count) + 1);
  console.log('THIS IS GUEST ID: ', guestId);
  console.log('THIS IS RANDOMNUM:', randomNum)
  return models.Answer.findAll({
    where: {
      GuestId: guestId,
      QuestionId: randomNum
    }
  }).then(function(result) {
    console.log('1.) THIS IS RANDOMNUM:',randomNum)
    console.log('2.) THIS IS RESULT ON ANSWER QUERY', result)
    //if question hasn't been answered query for that question
    if(result.length === 0) {
      return models.Question.findOne({
        where: {
          id: randomNum
        },
        include: [
          {model: models.Choice}
        ]
      }).then(function(question){
        console.log('3.) RETURNING RESULT', question)
        return question
      })
    } else {
      console.log('RECURSIVE CALL')
      selectQuestion()
    }
  })
}

//Find a Random Question for Guest
router.get('/guest/question', isAuthenticated, function (req, res) {
  return models.Question.count().then(function(questionCount){
    return models.Answer.findAll({
      where : {
        GuestId: req.user.id
      }
    })
    .then(function(answerCount){
      if(questionCount === answerCount.length) {
        return null
      } else {
        selectQuestion(questionCount, req.user.id).then(function(question){
          console.log('THIS IS QUESTION', question)
          res.json(question)
        })
      }
    })
  }).then(function(results){
    console.log('RESULTS WTFFFF', results)
    if(results === null){
      res.json({question: "All Answered"})
    }
  })
})

//Stores Guest's Answer to Question
router.post('/guest/answer/:qid', function (req,res) {
  models.Answer.create({
    GuestId: req.user.id,
    QuestionId: req.params.qid,
    choice: req.body.answer
  })
})

//Register an Admin
router.post('/admin/register', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  models.Admin.create({
    username: username,
    password: password
  }).then(function() {
    res.json({admin: username})
  })
})

//Register a Guest
router.post('/guest/register', function(req, res) {
  console.log('REGISTERING', req.body)
  var username = req.body.username;
  var password = req.body.password;
  models.Guest.create({
    username: username,
    password: password
  }).then(function() {
    res.json({guest: username})
  })
})

//Admin Login
router.post('/login/admin', passport.authenticate('local', { failureRedirect: '/' }), function(req, res){
  res.redirect('/admin');
})

//Guest Login
router.post('/login/guest', passport.authenticate('local', { failureRedirect: '/' }), function(req, res){
  console.log('HELLO')
  res.json(req.user)
})

app.use('/', router);

models.sequelize.sync().then(function() {
 var server = app.listen(app.get('port'), function() {
 console.log('Express server listening on port ' + server.address().port);
 });
});
