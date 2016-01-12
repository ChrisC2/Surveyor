angular
  .module('app.controllers', [])
  .controller('MainCtrl',['$scope', 'GuestService', '$location', function($scope, GuestService, $location){

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


    }
  }])

  .controller('GuestCtrl', ['$scope', 'GuestService', function($scope, GuestService){
    $scope.question = null;
    $scope.getQuestion = function(){
      GuestService.getQuestion()
      .then(function(question){
        console.log('THIS IS A QUESTION', question);
        $scope.question = question

      })
    }
  }])
