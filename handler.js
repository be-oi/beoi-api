'use strict';
const scores = require("./lib/scores")
const activities = require("./lib/activities")
const status = require("./lib/status")

function db_client() {
  let pg = require('pg');
  let db = new pg.Client({
    "driver": process.env.DB_DRIVER,
    "host": process.env.DB_HOST,
    "user": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE
  });
  db.connect();
  return db;
}

module.exports.index = (event, context, callback) => {
  return status.index(callback);
};

module.exports.ping = (event, context, callback) => {
  return status.ping(db_client(), callback);
};

module.exports.scores_history = (event, context, callback) => {
  return scores.history(db_client(), callback);
};

module.exports.scores_current = (event, context, callback) => {
  return scores.current(db_client(), callback);
};

/*
From the activty information. Compute the new score per day for each user.
*/
module.exports.scores_compute = (event, context, callback) => {
  return scores.compute(db_client(), callback);
};

module.exports.activities_latest = (event, context, callback) => {
  return activities.latest(db_client(), callback);
};

/*
Gather information about new activities of users.
For each user and platform, add an activity entity for each task which has been
completed for the first time since the last time it was checked.
*/
module.exports.activities_compute = (event, context, callback) => {
  return activities.compute(db_client(), callback);
};
