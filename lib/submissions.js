'use strict';

var _ = require('lodash');
var uva_submissions = require('./platforms/uva').get_user_submissions;

function user(db, event, callback) {
  var ret = [];

  var user = {};

  // Submission requests for all supported platforms
  var arr = [];

  // Allow custom id for better user identification
  if(event.id) {
    user.id = event.id;
  }
  // UVa
  if(event.uva) {
    user.uva = event.uva;
    arr.push(uva_submissions(db, event.uva));
  }

  // Return them back to the client
  Promise.all(arr).then(subs => {
    const res = {
      statusCode: 200,
      body: {
        user: user,
        submissions: _.flatten(subs).map(s => [s.platform, s.platform_submission_id, s.platform_problem_id, s.username, s.verdict, s.language, s.runtime, s.time]),
      },
    };
    callback(null, res);
  });
}


module.exports = {
  user,
};
