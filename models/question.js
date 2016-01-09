"use strict";

module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define("Question", {
    question : {
      type : DataTypes.STRING,
    }, {
      classMethods: {
        associate: function(models) {
          Question.belongsTo(models.Admin, {
            foreignKey: {
              allowNull: false
            }
          })
          Question.hasMany(models.Choice);
          Question.hasMany(models.Answer);
        }
      }
    }
  });
  return Question;
};
