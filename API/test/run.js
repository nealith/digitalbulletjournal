var run_count = 0;
var fail_count = 0;

var dao_user;
var dao_log;
var dao_topic;
var dao_log_user;
var dao_data;

// FULL DATA BASE
    // Create users
    // Create logs
    // Share logs
    // Create topics
    // Create simples data
    // Create compound data
    // Create models data

// USER TESTS
    // Create a user with create()
    // Create a user with new() and create_dao()
    // Create a user with new() and update()

    // Delete a user without log and without shared log
    // Delete a user with log and and without shared log
    // Delete a user with shared log and without log
    // Delete a user with shared log and log

    // Update a user

    // Get a user

// LOG TESTS
    // Create a log with create()
    // Create a log with new() and create_dao()
    // Create a log with new() and update()
    // Create a log with title that is already used

    // Delete a log that is not shared
    // Delete a log that is shared

    // Update a log
    // Get a log

// TOPIC TESTS
    // Create a topic with create()
    // Create a topic with new() and create_dao()
    // Create a topic with new() and update()
    // Create a topic with title that is already used

    // Delete a topic that is not shared
    // Delete a topic that is shared

    // Update a topic
    // Get a topic

// LOG_USER TESTS
    // Share a log

    // Unshare a log

    // Update a log_user

    // Get  à log_user

// DATA TESTS
    // Create a simple data with create()
    // Create a simple data with new() and create_dao()
    // Create a simple data with new() and update()

    // Create a compound data with create()
    // Create a compound data with new() and create_dao()
    // Create a compound data with new() and update()

    // Create a model data with create()
    // Create a model data with new() and create_dao()
    // Create a model data with new() and update()

    // Delete a simple data
    // Delete a compound data
    // Delete a model data

    // Update a simple data
    // Update a compound data
    // Update a model data

    // Get a simple data
    // Get a compound data
    // Get a model data



var DT_API = require('../api.js');

dao_user = new DT_API.DAO_USER(db);
dao_log = new DT_API.DAO_LOG(db);
dao_topic = new DT_API.DAO_TOPIC(db);
dao_log_user = new DT_API.DAO_LOG_USER(db);
dao_data = new DT_API.DAO_DATA(db);

var SQLITE_DB = require('../libdbj_db_sqlite.js');

var fs = require('fs');

var script = fs.readFileSync('../database_v2.sql', 'utf8');

var sqlite_db = new SQLITE_DB(':memory:');
sqlite_db.db.exec(script,function(err,args){
    if (!err) {
        run_test_on(sqlite_db);
    } else {
        console.log(err);
    }
});
