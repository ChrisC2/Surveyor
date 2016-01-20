//Configures Choice model and defines "belongs to" relationship with the Choice tables


"use strict";

module.exports = function(sequelize, DataTypes) {
  var Choice = sequelize.define("Choice", {
    choice: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Choice.belongsTo(models.Question, {
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  })
  return Choice;
}
