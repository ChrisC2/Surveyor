angular
  .module('app.services', [])
  .service('AdminService', ['$http', function($http){
    var questions = [];
    return {
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
      getQuestions: function(){
        return $http({
          method: 'GET',
          url: '/admin/questions',
        })
        .then(function(response){
          questions.push(response.data)
        })
      },
      postQuestion: function(question){
        return $http({
          method: 'POST',
          url: '/admin/add',
          data: {
            question: question
          }
        })
      }
    }
  }])

  .service('GuestService', ['$http', function($http){

    return {
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
      getQuestion: function(){
        return $http({
          method: 'GET',
          url: '/guest/question'
        }).then(function(data){
          console.log('THIS IS DATA', data)
          return data
        })
      },
      postAnswer: function(){

      }
    }
  }])
