'use strict';
const scores = require("./lib/scores")
const activities = require("./lib/activities")

function db_client() {
  let pg = require('pg');
  let db_config = require('./config/db.json');
  let db = new pg.Client(db_config['prod']);
  db.connect();
  return db;
}

module.exports.scores_history = (event, context, callback) => {
  return scores.history(db_client(), callback);
};

module.exports.scores_current = (event, context, callback) => {
  return scores.current(db_client(), callback);
};

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
