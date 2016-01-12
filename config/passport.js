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
  })
  .then(function(adminUser){
    if(!adminUser){
      models.Guest.find({
        where: {
          id: id
        }
      }).then(function(guestUser){
        done(null, {id: guestUser.id, name: guestUser.username} )
      })
    } else {
      done(null, {id: adminUser.id, name: adminUser.username} )
    }
  }).error(function(err){
    done(err, null)
  })
})

// Use local strategy to check whether user is Admin or Guest
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('INSIDE PASSPORT USER:', username, password)
    models.Admin.find({
      where: {
        username: username
      }
    }).then(function(adminUser){
      if(!adminUser) {
        console.log('NOT ADMIN')
        //Not Admin so check if Guest
        models.Guest.find({
          where: {
            username: username
          }
        }).then(function(guestUser){
          console.log('THIS IS GUEST USER')
          if(!guestUser) {
            //Neither Guest or Admin
            done(null, false, { message: 'Unknown user' });
          } else if(password != guestUser.password) {
            done(null, false, { message: 'Invalid password'});
          } else {
            console.log('USER FOUND!')
            done(null, guestUser);
          }
        })
      } else {
        console.log('FALLOUT NEITHER')
        //User is Admin
        if(password != adminUser.password){
          done(null, false, { message: 'Invalid password'});
        } else {
          console.log('ADMIN EXISTS')
          done(null, adminUser);
        }
      }
    }).error(function(err) {
      done(err)
    })
  }))
}
