var router = require('express').Router();
var models = require('../models');
var helpers = require('./helper.js');
var passport = require('passport');
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');

//Get the Admin's Questions and their Answers
router.get('/admin/questions', helpers.isAuthenticated, function(req, res) {
  models.Question.findAll({
    where: {
      AdminId: req.user.id
    },
    include: [
      {model: models.Choice},
      {model: models.Answer}
    ]
  }).then(function(questions) {
    res.json(questions);
  })
})

//Allows Admin to add a Question
router.post('/admin/add', function (req, res) {
  return models.Question.create({
    question: req.body.question,
    AdminId: req.user.id
  }).then(function(data){
    res.json({
      questionId: data.dataValues.id
    });
  })
})

//Allows Admin to add Choices to their Question
router.post('/admin/choice/:qid', function (req, res) {
  return models.Choice.create({
    QuestionId: req.params.qid,
    AdminId: req.user.id,
    choice: req.body.choice
  }).then(function(data){
    res.json(data.dataValues.choice)
  })
})

//Find a Random Question for Guest
router.get('/guest/question', helpers.isAuthenticated, function (req, res) {
  console.log('THIS IS TOTAL---------------------------------', models.Question.count())
  return models.Question.count().then(function(questionCount){
    return models.Answer.findAll({
      where : {
        GuestId: req.user.id
      }
    }).then(function(answerCount){
      if(questionCount === answerCount.length) {
        return null
      } else {
        var resolvedQuestion = Promise.resolve(resolvedQuestion).then(function(){
          return helpers.selectQuestion(questionCount, req.user.id)
        })
        return resolvedQuestion
      }
    })
  }).then(function(results){
    console.log('THIS IS SENT---------------------------------------------------', results)
    if(results === null){
      res.json({question: "All Answered"})
    } else {
      res.json(results)
    }
  })
})

//Stores Guest's Answer to Question
router.post('/guest/answer/:qid', function (req,res) {
  models.Answer.create({
    GuestId: req.user.id,
    QuestionId: req.params.qid,
    answer: req.body.answer
  }).then(function(){
    res.send('answer submitted')
  })
})

//Register an Admin
router.post('/admin/register', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
//Check if Admin already exists
  models.Admin.findAll({
    where: {
      username: username
    }
  }).then(function(user){
    if(user.length !== 0){
      res.send('User Already Exists')
    } else {
      //hash password before storing
      var hash = bcrypt.hashSync(password);
      models.Admin.create({
        username: username,
        password: hash
      }).then(function() {
        res.json({admin: username})
      })
    }
  })
})

//Register a Guest
router.post('/guest/register', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
//Check if that Guest already exists
  models.Guest.findAll({
    where: {
      username: username
    }
  }).then(function(user){
    if(user.length !== 0){
      res.send('User Already Exists');
    } else {
      //hash password before storing
      var hash = bcrypt.hashSync(password);
      models.Guest.create({
        username: username,
        password: hash
      }).then(function() {
        res.json({guest: username})
      })
    }
  })
})

//Admin Login
router.post('/login/admin', passport.authenticate('local', { failureRedirect: '/' }), function(req, res){
  res.json(req.user)
})

//Guest Login
router.post('/login/guest', passport.authenticate('local', { failureRedirect: '/' }), function(req, res){
  res.json(req.user)
})

//Logout
router.get('/logout', function(req, res){
  req.session.destroy();
  req.logout();
  res.redirect('/');
});

module.exports = router;
