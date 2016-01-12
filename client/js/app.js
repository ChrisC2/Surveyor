angular
  .module('app',['ngRoute', 'app.controllers', 'app.services', 'ui.bootstrap'])
  .config(['$routeProvider', function ($routeProvider){
    $routeProvider
      .when('/', {
        controller: 'MainCtrl',
        templateUrl: '/templates/home.html'
      })
      .when('/admin-login', {
        controller: 'MainCtrl',
        templateUrl: '/templates/admin-login.html'
      })
      .when('/guest-login', {
        controller: 'MainCtrl',
        templateUrl: '/templates/guest-login.html'
      })
      .when('/admin-register', {
        controller: 'MainCtrl',
        templateUrl: '/templates/admin-register.html'
      })
      .when('/guest-register', {
        controller: 'MainCtrl',
        templateUrl: '/templates/guest-register.html'
      })
      .when('/admin', {
        controller: 'AdminCtrl',
        templateUrl: '/templates/admin.html'
      })
      .when('/guest', {
        controller: 'GuestCtrl',
        templateUrl: '/templates/guest.html'
      })
      .otherwise({
        redirectTo: '/'
      })
  }])
