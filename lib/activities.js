'use strict';

function latest(db, callback) {
  db.query('SELECT count(*) from categories')
    .then(result => {
      var val = result.rows[0];
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Go! Serverless v1.0! Your function executed successfully!',
          value: val
        }),
      };
      callback(null, response);
    }).then(() => db.end());
}

function compute(db, callback) {
  db.query('SELECT count(*) from categories')
    .then(result => {
      var val = result.rows[0];
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Go! Serverless v1.0! Your function executed successfully!',
          value: val
        }),
      };
      callback(null, response);
    }).then(() => db.end());
}

module.exports = {
  latest,
  compute
}
