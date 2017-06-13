'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {

  return db.createTable('uva_users', {
    uva_user_id: { type: 'serial',  primaryKey: true },
    uva_id: { type: 'int' },
    uva_username: { type: 'string', length: 50, notNull: true, unique: true },
  }).then(
    function(result) {
      db.runSql(
        'CREATE TABLE submissions (\n' +
          'platform varchar(50),\n' +
          'platform_submission_id integer,\n' +
          'platform_problem_id varchar(50) NOT NULL,\n' +
          'username text NOT NULL,\n' +
          'verdict varchar(50) NOT NULL,\n' +
          'language varchar(50) NOT NULL,\n' +
          'runtime integer,\n' +
          'time bigint,\n' +
          'primary key (platform, platform_submission_id)\n' +
        ');\n'
      );
    }
  ).then(
    function(result) {
      db.runSql(
        'CREATE TABLE problems (\n' +
          'platform varchar(50),\n' +
          'platform_problem_id varchar(50),\n' +
          'platform_extra_data varchar,\n' +
          'title varchar NOT NULL,\n' +
          'primary key (platform, platform_problem_id)\n' +
        ');\n'
      );
    }
  );
};

exports.down = function(db) {
  return db.dropTable('uva_users').
    then( function(result) {
      db.dropTable('submissions');
    }).then( function(result) {
      db.dropTable('problems');
    });
};

exports._meta = {
  "version": 1
};
