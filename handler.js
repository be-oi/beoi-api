'use strict';
const scores = require("./lib/scores")
const activities = require("./lib/activities")
const status = require("./lib/status")
const submissions = require("./lib/submissions");
const problems = require("./lib/problems");

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

/**
 * Gather all the submissions of a given user
 */
module.exports.submissions_user = (event, context, callback) => {
  return submissions.user(db_client(), event, callback);
};

/**
 * Gather all the problems
 */
module.exports.problems_all = (event, context, callback) => {
  return problems.all(db_client(), callback);
};

/**
 * Update UVa problems
 */
module.exports.uva_update_problems = (event, context, callback) => {
  require('./lib/platforms/uva.js').update_problems(db_client());
  callback();
};
