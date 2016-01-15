angular
  .module('app.services', [])
  .service('AdminService', ['$http', function($http){
    var questions = [];
    return {
      //Registers and Admin
      adminRegister: function(username, password){
        return $http({
          method: 'POST',
          url: '/admin/register',
          data: {
            username: username,
            password: password
          }
        })
      },
      //Login for Admin
      adminLogin: function(username, password){
        return $http({
          method: 'POST',
          url: '/login/admin',
          data: {
            username: username,
            password: password
          }
        })
      },
      /* GET request for Admin's posted Questions
      * Maps data in form of:
      [{question: question, answers: [{answer: answer, count: count},..],...]
      */
      getQuestions: function(){
        return $http({
          method: 'GET',
          url: '/admin/questions',
        })
        .then(function(response){
          var questionStorage = [];
          response.data.forEach(function(questionData){
            var storageObj = {};
            var answerStorage = [];
            questionData.Choices.forEach(function(choiceData){
              storageObj[choiceData.choice] = 0;
            })
            questionData.Answers.forEach(function(answerData){
              storageObj[answerData.answer] = storageObj[answerData.answer] + 1;
            })
            for(var answer in storageObj){
              answerStorage.push({
                answer: answer,
                count: storageObj[answer]
              });
            }
            questionStorage.push({
              question: questionData.question,
              answers: answerStorage
            })
          })
          return questionStorage
        })
      },
      //Allows Admin to post a question
      postQuestion: function(question){
        return $http({
          method: 'POST',
          url: '/admin/add',
          data: {
            question: question
          }
        })
      },
      //Allows Admin to add Choices to their question
      addChoice: function(questionId, choice){
        return $http({
          method: 'POST',
          url: '/admin/choice/' + questionId,
          data: {
            choice: choice
          }
        })
      }
    }
  }])

  .service('GuestService', ['$http', function($http){

    return {
      //Register's a Guest
      guestRegister: function(name, pw){
        return $http({
          method: 'POST',
          url: '/guest/register',
          data: {
            username: name,
            password: pw
          }
        })
      },
      //Login for Guest
      guestLogin: function(username, password){
        return $http({
          method: 'POST',
          url: '/login/guest',
          data: {
            username: username,
            password: password
          }
        })
      },
      //Fetches a random question that hasn't previously been answered
      getQuestion: function(){
        return $http({
          method: 'GET',
          url: '/guest/question'
        }).success(function(data){
          return data
        })
      },
      //Posts an answer to random survey question
      postAnswer: function(questionId, answer){
        return $http({
          method: 'POST',
          url: 'guest/answer/' + questionId,
          data: {
            answer: answer
          }
        })
      }
    }
  }])
