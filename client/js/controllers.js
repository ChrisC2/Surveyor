angular
  .module('app.controllers', [])
  .controller('MainCtrl',['$scope', 'GuestService', 'AdminService', '$location', function($scope, GuestService, AdminService, $location){

    $scope.guestLogin = function(user){
      var username = user.username;
      var password = user.password;
      GuestService.guestLogin(username, password)
      .success(function(guest){
        if(guest.username) {
          $location.path('/guest')
        } else {
          $location.path('/')
        }
      })
    },
    $scope.adminLogin = function(user){
      var username = user.username;
      var password = user.password;
      AdminService.adminLogin(username, password)
      .success(function(admin){
        if(admin.username) {
          $location.path('/admin')
        } else {
          $location.path('/')
        }
      })
    },
    $scope.guestRegister = function(user){
      var username = user.username;
      var password = user.password;
      GuestService.guestRegister(username, password)
      .success(function(){
        $location.path('/guest-login')
      })
    },
    $scope.adminRegister = function(user){
      var username = user.username;
      var password = user.password;
      AdminService.adminRegister(username, password)
      .success(function(){
        $location.path('/admin-login')
      })
    }

  }])

  .controller('GuestCtrl', ['$scope', 'GuestService', function($scope, GuestService){
    $scope.question = null;
    $scope.answerStorage = [];

    $scope.getQuestion = function(){
      GuestService.getQuestion()
      .then(function(returnObj){
        $scope.question = {
          questionId: returnObj.data.id,
          question: returnObj.data.question
        };
        returnObj.data.Choices.forEach(function(answer){
          $scope.answerStorage.push({
            answerId: answer.id,
            answer: answer.choice
          })
        })
      })
    },
    $scope.postAnswer = function(questionId, answer) {
      GuestService.postAnswer(questionId, answer)
      .success(function(submit){
        $scope.answerStorage = [];
        $scope.question = null;
      }).then(function(){
        $scope.getQuestion()
      })
    }
  }])
  .controller('AdminCtrl', ['$scope', 'AdminService', function($scope, AdminService){
    $scope.questionStorage = [];
    $scope.currentQuestion = null;
    $scope.currentChoices = [];

    $scope.getQuestions = function(){
      AdminService.getQuestions()
      .then(function(data){
        $scope.questionStorage = data;
      })
    },
    $scope.postQuestion = function(question) {
      AdminService.postQuestion(question)
      .success(function(data){
        $scope.currentQuestion = {
          question: question,
          questionId: data.questionId
        };
      })
    },
    $scope.addChoice = function(questionId, choice){
      AdminService.addChoice(questionId, choice)
      .success(function(choice){
        $scope.currentChoices.push(choice)
      })
    },
    $scope.resetQuestion = function(){
      $scope.currentQuestion = null;
      $scope.currentChoices = [];
      $scope.getQuestions();
    }
  }])
