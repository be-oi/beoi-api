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

  return db.createTable('categories', {
    category_id: { type: 'int', primaryKey: true },
    title: { type: 'string', length: 50, notNull: false},
    title_fr: { type: 'string', length: 50, notNull: false},
    title_nl: { type: 'string', length: 50, notNull: false},
  }).then(
    function(result) {
      db.createTable('topics', {
        topic_id: { type: 'int', primaryKey: true },
        category_id: { type: 'int', foreignKey: { name: 'topics_category_id_fk', table: 'categories', rules: { onDelete: 'CASCADE' }, mapping: 'category_id' } },
        title: { type: 'string', length: 50, notNull: false},
        title_fr: { type: 'string', length: 50, notNull: false},
        title_nl: { type: 'string', length: 50, notNull: false},
      });
    }
  ).then(
    function(result) {
      db.createTable('tasks', {
        task_id: { type: 'int', primaryKey: true },
        title: { type: 'string', length: 50, notNull: false},
        title_fr: { type: 'string', length: 50, notNull: false},
        title_nl: { type: 'string', length: 50, notNull: false},
        platform: { type: 'string', length: 50},
        platform_task_id: { type: 'string', length: 50},
      });
    }
  ).then(
    function(result) {
      db.createTable('topic_tasks', {
        task_id: { type: 'int', foreignKey: { name: 'topic_tasks_task_id_fk', table: 'tasks', rules: { onDelete: 'CASCADE' }, mapping: 'task_id', primaryKey: true } },
        topic_id: { type: 'int', foreignKey: { name: 'topic_tasks_topic_id_fk', table: 'topics', rules: { onDelete: 'CASCADE' }, mapping: 'topic_id' } },
        order: { type: 'int' },
      });
    }
  ).then(
    function(result) {
      db.createTable('users', {
        user_id: { type: 'int', primaryKey: true },
        firstname: { type: 'string', length: 50},
        lastname: { type: 'string', length: 50},
        uva_id: { type: 'string', length: 50},
        uva_last_check: 'datetime',
        codeforce_handle: { type: 'string', length: 50},
        codeforce_last_check: 'datetime',
        skill_score: 'int'
      });
    }
  ).then(
    function(result) {
      db.createTable('activities', {
        task_id: { type: 'int', foreignKey: { name: 'activities_task_id_fk', table: 'tasks', rules: { onDelete: 'CASCADE' }, mapping: 'task_id' }, primaryKey: true },
        user_id: { type: 'int', foreignKey: { name: 'activities_user_id_fk', table: 'users', rules: { onDelete: 'CASCADE' }, mapping: 'user_id' }, primaryKey: true },
        time: 'datetime',
        language: { type: 'string', length: 10, notNull: false},
      });
    }
  ).then(
    function(result) {
      db.createTable('scores', {
        user_id: { type: 'int', primaryKey: true },
        time: { type: 'date', primaryKey: true },
        score: 'int',
        score_type: { type: 'string', length: 25 },
      });
    }
  );


};

exports.down = function(db) {
  return db.dropTable('scores')
    .then( function(result) {
      db.dropTable('activities');
    }).then( function(result) {
      db.dropTable('users');
    }).then( function(result) {
      db.dropTable('topic_tasks');
    }).then( function(result) {
      db.dropTable('tasks');
    }).then( function(result) {
      db.dropTable('topics');
    }).then( function(result) {
      db.dropTable('categories');
    });
};

exports._meta = {
  "version": 1
};
