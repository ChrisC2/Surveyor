"use strict";

module.exports = function(sequelize, DataTypes) {
  var Answer = sequelize.define("Answer", {
    answer : {
      type : DataTypes.STRING,
    }
  }, {
    classMethods: {
      associate: function(models) {
        Answer.belongsTo(models.Guest, {
          foreignKey: {
            allowNull: false
          }
        })
        Answer.belongsTo(models.Question, {
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  })
  return Answer;
};
