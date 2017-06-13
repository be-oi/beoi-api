var _ = require('lodash');

function all(db, callback) {
  db.query('SELECT * FROM problems;', (err, result) => {
    if(err) throw err;

    const res = {
      statusCode: 200,
      body: {
        problems: _.map(result.rows, p => [p.platform, p.platform_problem_id, p.platform_extra_data, p.title]),
      },
    };
    callback(null, res);
  });
}


module.exports = {
  all,
};
