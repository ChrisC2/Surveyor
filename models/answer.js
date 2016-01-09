"use strict";

module.exports = function(sequelize, DataTypes) {
  var Answer = sequelize.define("Answer", {
    answer : {
      type : DataTypes.STRING,
    }, {
      classMethods: {
        associate: function(models) {
          Question.belongsTo(models.Guest, {
            foreignKey: {
              allowNull: false
            }
          })
          Question.belongsTo(models.Question, {
            foreignKey: {
              allowNull: false
            }
          })
        }
      }
    }
  });
  return Answer;
};
