//Configure & initialize all models for the tables Admin, Guest, Question, Answer, & Choice


"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
// var env = process.env.NODE_ENV || "development";
// var config = require(__dirname + '/../config/config.json')[env];
var sequelize;

if(process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    pool: { 
      maxConnections: 5,
      minConnections: 0,
      maxIdleTime: 10000
    },
  })
} else {
  sequelize = new Sequelize('Surveyor', 'root', null, {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
  });
}

var db = {};

fs.readdirSync(__dirname).filter(function(file) {
 return (file.indexOf(".") !== 0) && (file !== "index.js");
}).forEach(function(file) {
 var model = sequelize["import"](path.join(__dirname, file));
 db[model.name] = model;
});

Object.keys(db).forEach(function(modelName) {
 if ("associate" in db[modelName]) {
 db[modelName].associate(db);
 }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
