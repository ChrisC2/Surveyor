var LocalStrategy = require('passport-local').Strategy;
var models = require('../models');

module.exports = function (passport) {

// Serialize sessions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.Admin.find({
    where: {
      id: id
    }
  }).success(function(user){
    done(null, {id: user.id, name: user.username});
  }).error(function(err){
    done(err, null);
  });
});

// Use local strategy to check whether user is Admin or Guest
passport.use(new LocalStrategy(
  function(username, password, done) {
    models.Admin.find({
      where: {
        username: username
      }
    }).then(function(adminUser){
      if(!adminUser) {
        //Not Admin so check if Guest
        models.Guest.find({
          where: {
            username: username
          }
        }).then(function(guestUser){
          if(!guestUser) {
            //Neither Guest or Admin
            done(null, false, { message: 'Unknown user' });
          } else if(password != guestUser.password) {
            done(null, false, { message: 'Invalid password'});
          } else {
            done(null, user);
          }
        })
      } else {
        //User is Admin
        if(password != adminUser.password){
          done(null, false, { message: 'Invalid password'});
        } else {
          done(null, user);
        }
      }
    }).error(function(err) {
      done(err)
    })
  }))
}
