angular
  .module('app.controllers', ['ui.bootstrap'])
  .controller('MainCtrl',['$scope', 'GuestService', 'AdminService', '$location', '$rootScope', function($scope, GuestService, AdminService, $location, $rootScope){

    $scope.guestLogin = function(user){
      var username = user.username;
      var password = user.password;
      GuestService.guestLogin(username, password)
      .success(function(guest){
        if(guest.username) {
          $rootScope.loggedInUser = true;
          $rootScope.guest = true;
          $rootScope.admin = false;
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
          $rootScope.loggedInUser = true;
          $rootScope.guest = false;
          $rootScope.admin = true;
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
      .success(function(response){
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
        if(returnObj.data.question === "All Answered") {
          return
        } else {
          returnObj.data.Choices.forEach(function(answer){
            $scope.answerStorage.push({
              answerId: answer.id,
              answer: answer.choice
            })
          })
        }
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
  .controller('AdminCtrl', ['$scope', 'AdminService', '$modal', function($scope, AdminService, $modal){
    $scope.questionStorage = [];
    $scope.currentQuestion = null;
    $scope.currentChoices = [];

    $scope.getQuestions = function(){
      AdminService.getQuestions()
      .then(function(data){
        $scope.questionStorage = data;
      })
    },
    $scope.open = function (index) {
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'modalContent.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          question: function () {
          return $scope.questionStorage[index];
        }
      }
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
  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, question) {
  $scope.question = question;
  $scope.countVotes = function(){
    var count = 0;
    $scope.question.answers.forEach(function(answer){
      count += answer.values[0];
    })
    return count
  }
  $scope.count = $scope.countVotes();

  $scope.chartJson = {
        globals: {
            shadow: false,
            fontFamily: "Verdana",
            fontWeight: "100"
        },
        type: "pie3d",
        backgroundColor: "#fff",

        legend: {

            borderColor: "transparent",
            marker: {
                borderRadius: 10,
                borderColor: "transparent"
            },
            align: "left"
        },
        tooltip: {
            text: "%v votes"
        },
        plot: {
            valueBox: {
                placement: "in",
                text: "%npv %",
                fontSize: "15px",
                textAlpha: 1,
                rules: [{
                  rule: "%v == 0",
                  visible: false
                }]
            },
        },
        series: $scope.question.answers
    };
  $scope.cancel = function () {
    $modalInstance.dismiss();
  };
});
