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
        if(guest.username) {
          $location.path('/admin-login')
        } else {
          $location.path('/')
        }
      })
    },
    $scope.guestRegister = function(user){
      var username = user.username;
      var password = user.password;
      GuestService.guestLogin(username, password)
      .success(function(guest){
        if(guest.username) {
          $location.path('/guest-login')
        } else {
          $location.path('/')
        }
      })
    },
    $scope.adminRegister = function(user){
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
