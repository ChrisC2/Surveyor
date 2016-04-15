angular
  .module('app',['ngRoute', 'app.controllers', 'app.services', 'ui.bootstrap', 'zingchart-angularjs'])
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

  .run(function($rootScope, $location) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      //Checks to make sure only a logged in admin can access the page
      if(next.templateUrl === '/templates/admin.html' && $rootScope.admin) {
        $location.path('/admin');
      //Checks to make sure only a logged in guest can access the page
      } else if(next.templateUrl === '/templates/guest.html' && $rootScope.guest) {
        $location.path('/guest');
      } else if(next.templateUrl === '/templates/admin-login.html') {
        $location.path('/admin-login');
      } else if(next.templateUrl === '/templates/guest-login.html') {
        $location.path('/guest-login');
      } else if(next.templateUrl === '/templates/guest-register.html') {
        $location.path('/guest-register');
      } else if(next.templateUrl === '/templates/admin-register.html') {
        $location.path('/admin-register');
      } else {
        $location.path('/')
      }
    });
  });
