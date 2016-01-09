"use strict";

module.exports = function(sequelize, DataTypes) {
  var Guest = sequelize.define("Guest", {
    username : {
      type : DataTypes.STRING,
      allowNull : false,
    },
    password : {
      type : DataTypes.STRING,
    }, {
      classMethods: {
        associate: function(models) {
          Guest.hasMany(models.Answer)
        }
      }
    }
  });
  return Guest;
};
