'use strict';

function index(callback) {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello!'
    }),
  };
  callback(null, response);
}


function ping(db, callback) {
  return db.query('SELECT count(*) from categories')
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'It works, including database connection !'
        }),
      };
      callback(null, response);
    }).then(() => db.end());
}

module.exports = {
  ping,
  index,
}
