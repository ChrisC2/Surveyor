var models = require('../models');
var helpers = {};

  //Protect routes by checking if user is authenticated
  helpers.isAuthenticated = function (req, res, next) {
    if (req.user) {
      return next();
    } else {
      res.redirect('/');
    }
  }

  //Recursively Selects a random Id to Query for GET '/guest/question' route
  helpers.selectQuestion = function (count, guestId) {
    console.log('INSIDE HELPER FUNCTION')
    //Check if that Question Id has already been answered
    var randomNum = Math.floor((Math.random() * count) + 1);
    return models.Answer.findAll({
      where: {
        GuestId: guestId,
        QuestionId: randomNum
      }
    }).then(function(result) {
      //If question hasn't been answered query for that question
      if(result.length === 0) {
        return models.Question.findOne({
          where: {
            id: randomNum
          },
          include: [
            {model: models.Choice}
          ]
        }).then(function(question){
          console.log('THIS IS THE RETURNED QUESTION------', question)
          return question
        })
      } else {
        console.log('RECURSING')
        //Else recurse to find an unanswered question
        return helpers.selectQuestion(count, guestId)
      }
    })
  }

module.exports = helpers;
