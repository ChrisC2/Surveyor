var express = require('express');
// var routes = require('./routes');
// var user = require('./routes/user');
var errorhandler = require('errorhandler')
var http = require('http');
var path = require('path');
var models = require('./models');
var app = express();
var router = express.Router();
var Sequelize = require("sequelize");
var Promise = require('bluebird');
// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname + './client')));

// development only
if ('development' == app.get('env')) {
    app.use(errorhandler());
}

//Get the Admin's Questions and their Answers
router.get('/admin/questions', function(req, res) {
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

//-------------TEST
// models.Question.create({
//   question: "What is your favorite car?",
//   AdminId: 1
// })
// models.Choice.create({
//   QuestionId: 2,
//   AdminId: 1,
//   choice: "PORSCHE"
// })
//
// models.Question.create({
//   question: 'what do you like to fly?',
//   AdminId: 1
// })
// models.Choice.create({
//   QuestionId: 3,
//   AdminId: 1,
//   choice: "Nekkid"
// })
//-------------?TEST

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

var selectQuestion = function (count, guestId) {
  //Select random Id to Query
  //Check if that Id has already been answered
  var randomNum = Math.floor((Math.random() * count) + 1);
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
        }
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
router.get('/guest/question', function (req, res) {
  models.Question.count().then(function(questionCount) {
    return models.Answer.count().then(function(answerCount){
      if(questionCount === answerCount) {
        return null
      } else {
        return selectQuestion(questionCount, 1)
      }
    })
  }).then(function(results){
    if(results === null) {
      console.log('ALL QUESTIONS HAVE BEEN ANSWERED', results)
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
    choice: req.body.answer
  })
})

app.use('/', router);

models.sequelize.sync().then(function() {
 var server = app.listen(app.get('port'), function() {
 console.log('Express server listening on port ' + server.address().port);
 });
});
