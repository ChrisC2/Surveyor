//Configures Admin model and defines One to Many Relationship with the Question table

"use strict";

module.exports = function(sequelize, DataTypes) {
  var Admin = sequelize.define("Admin", {
    username : {
      type : DataTypes.STRING,
      allowNull : false
    },
    password : {
      type : DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Admin.hasMany(models.Question)
      }
    }
  })
  return Admin;
};
