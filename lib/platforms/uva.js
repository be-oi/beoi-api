//=================
//==== UVA API ====
//=================

/**
 * This file includes all the logic behind the UVa/uHunt part of the API.
 */

'use strict';

const request = require('request');
const sprintf = require('sprintf-js').sprintf;
const _ = require('lodash');

const UVA_USERNAME_TO_ID = 'https://uhunt.onlinejudge.org/api/uname2uid/%s';
const UVA_USER_SUBMISSIONS = 'http://uhunt.onlinejudge.org/api/subs-user/%s';
const UVA_PROBLEMS = 'http://uhunt.onlinejudge.org/api/p';

/**
 * Make sure the user <user> has the correct user id in the database.
 */
function update_user_id(db, uva_username, callback) {
  // uHunt query
  request(sprintf(UVA_USERNAME_TO_ID, uva_username), (err, res, body) => {
    if(err) throw err;

    // Check for user in the db
    db.query('SELECT * FROM uva_users WHERE uva_username = $1 LIMIT 1;', [uva_username], (err, result) => {
      if(err) throw err;
      var user = result.rows[0];
      // If the user is not in db, add it
      if(!user) {
        // Don't add non existing users
        if(body == 0)
          return;

        db.query('INSERT INTO uva_users (uva_id, uva_username) VALUES ($1::integer, $2) RETURNING *;', [body, uva_username], (err, result) => {
          if(err) throw err;
          callback(db, result.rows);
        });
      }
      // If the user changed name, remove the submissions and update the user in the db
      else if(body != user.uva_id) {
        db.query("BEGIN;");
        db.query("DELETE FROM submissions WHERE platform = 'UVa' AND username = $1;", [user.uva_username], (err) => {
          if(err) throw err;
        });
        // Update if the user still has a valid ID
        if(body != 0)
          db.query("UPDATE uva_users SET uva_id = $1::integer WHERE uva_username = $2;", [body, user.uva_username], (err) => {
            if(err) throw err;
          });
        // Remove if the user doesn't exist anymore
        else
          db.query("DELETE FROM uva_users WHERE uva_username = $1;", [user.uva_username], (err) => {
            if(err) throw err;
          });

        db.query("COMMIT;", (err) => {
          if(err) throw err;

          // Only fetch the submissions if the user actually exists
          if(body != 0)
            callback(db, body);
        });
      }
      else
        callback(db, user);
    });
  });
}

/**
 * Update the submissions for user <user>
 */
function update_user_submissions(db, user) {
  request(sprintf(UVA_USER_SUBMISSIONS, user.uva_id), (err, res, body) => {
    if(err) throw err;

    /*
     * Possible improvement: only ask for new submissions (with id > than the last one in the db)
     * Drawbacks: more complicated and may cause missing data issues
     *
     * Also, doing all the updates in one query might actually be better.
     */

    var data = JSON.parse(body).subs;
    _.forEach(data, (sub) => {
      db.query(
        // SQL Query
        'INSERT INTO submissions VALUES\n' +
          '(\'UVa\', $1::integer, $2, $3, $4, $5, $6::integer, $7::bigint)\n' +
        'ON CONFLICT(platform, platform_submission_id) DO UPDATE SET\n' +
          'verdict = EXCLUDED.verdict,\n' +
          'runtime = EXCLUDED.runtime;\n',
        // Parameters
        [sub[0], sub[1], user.uva_username, get_verdict_text(sub[2]), get_language_text(sub[5]),sub[3], sub[4]],
        // Callback
        (err) => {
          if(err) throw err;
      });
    });
  });
}

/**
 * Get the submissions for user with username <uva_username>
 */
function get_user_submissions(db, uva_username) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM submissions WHERE platform = \'UVa\' AND username = $1;', [uva_username], (err, result) => {
      if(err) throw err; // Should this reject ?

      resolve(result.rows);
      update_user_id(db, uva_username, update_user_submissions);
    });
  });
}

/**
 * Update the stored problems
 */
function update_problems(db) {
  request(UVA_PROBLEMS, (err, res, body) => {
    if(err) throw err;

    var data = JSON.parse(body);
    _.forEach(data, (p) => {
      db.query('INSERT INTO problems VALUES (\'UVa\', $1, $2, $3);', [p[0], p[1], p[2]], (err) => {
        if(err) throw err;
      });
    });
  });
}

module.exports = {
  get_user_submissions: get_user_submissions,
  update_problems: update_problems,
};

//=============================
//==== UTILITARY FUNCTIONS ====
//=============================
var verdicts = {
  10: 'Submission error',
  15: 'Can\'t be judged',
  20: 'In judge queue',
  30: 'Compile error',
  35: 'Restricted function',
  40: 'Runtime error',
  45: 'Output limit exceeded',
  50: 'Time limit exceeded',
  60: 'Memory limit exceeded',
  70: 'Wrong answer',
  80: 'Presentation error',
  90: 'Accepted',
};

function get_verdict_text(verdict) {
  return verdicts[verdict] || 'In judge queue';
}

var languages = {
  1: 'C',
  2: 'Java',
  3: 'C++',
  4: 'Pascal',
  5: 'C++', // C++11
  6: 'Python', // Python 3
};

function get_language_text(language) {
  return languages[language];
}
