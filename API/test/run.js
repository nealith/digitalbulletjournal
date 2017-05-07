var DT_API = require('../api.js');

var run_count = 0;
var fail_count = 0;

var dao_user;
var dao_log;
var dao_topic;
var dao_log_user;
var dao_data;

// FULL DATA BASE

function full_db(callback){
    // Create users

    var users = new Array();

    function create_users(callback){
        var m = 0;
        var n = 5;
        function create_user(err,args){
            if (!err) {
                users.push(args);
                m++;
                if (m == n) {
                    callback(err,args);
                } else {
                    dao_user.create('user'+m,'user'+m,'user'+m,'user'+m,'user'+m+'@users.com',create_user);
                }

            } else {
                callback(err,args);
            }
        }
        dao_user.create('user'+m,'user'+m,'user'+m,'user'+m,'user'+m+'@users.com',create_user);
    }
    // Create logs

    var logs = new Array();

    function create_logs(callback){
        var m = 0;
        var n = 5;
        function create_log(err,args){
            if (!err) {
                logs.push(args);
                m++;

                if (m == n) {
                    callback(err,args);
                } else {
                    dao_log.create(users[m].id,true,'title'+m,create_log);
                }

            } else {
                callback(err,args);
            }
        }
        dao_log.create(users[m].id,true,'title'+m,create_log);
    }

    // Share logs

    function share_logs(callback){
        callback(null,null);
    }

    // Create topics

    var topics = new Array();

    function create_topics(callback){
        var m = 0;
        var n = 5;
        function create_topic(err,args){
            if (!err) {
                topics.push(args);
                m++;
                if (m == n) {
                    callback(err,args);
                } else {
                    dao_topic.create(logs[m].id,'title'+m,create_topic);
                }

            } else {
                callback(err,args);
            }
        }
        dao_topic.create(logs[m].id,'title'+m,create_topic);
    }

    // Create simples data

    function create_simples_data(callback){
        var m = 0;
        var n = 5;
        function create_data(err,args){
            if (!err) {
                m++;
                if (m == n) {
                    callback(err,args);
                } else {
                    dao_data.create(topics[m].id,users[m].id,'Text','lol'+m,create_data);
                }

            } else {
                callback(err,args);
            }
        }
        dao_data.create(topics[m].id,users[m].id,'Text','test'+m,create_data);
    }

    // Create compound data

    function create_compounds_data(callback){
        var m = 0;
        var n = 5;

        function new_composite(no){
            var value = new Object();

            for (var i = 0; i < 5; i++) {
                value['t'+i] = new DT_API.DAO_DATA(dao_data.db,null,null,topics[m],users[m],'Text','test_c'+i,null);
            }

            if (no < m) {
                value['t5'] = new_composite(5);
            }

            var dao = new DT_API.DAO_DATA(dao_data.db,null,null,topics[m],users[m],'Compound',value,null);



            return dao;
        }

        function create_data(err,args){
            if (!err) {
                m++;
                if (m == n) {
                    callback(err,args);
                } else {
                    new_composite(m).update(create_data);
                }

            } else {
                callback(err,args);
            }
        }
        new_composite(m).update(create_data);
    }

    // Create models data

    function create_models_data(callback){
        var m = 0;
        var n = 5;

        function new_model(no){
            var value = new Object();

            for (var j = 0; j < 5; j++) {
                value['s'+j] = new Array();
                for (var i = 0; i < 5; i++) {
                    value['s'+j]['t'+i] = new DT_API.DAO_DATA(dao_data.db,null,null,topics[m],users[m],'Text','test_c'+i,null);
                }
                if (no < m) {
                    value['s'+j]['t5'] = new_composite(5);
                }

            }
            var dao = new DT_API.DAO_DATA(dao_data.db,null,null,topics[m],users[m],'Model',value,null);

            return dao;
        }

        function create_data(err,args){
            if (!err) {
                m++;
                if (m == n) {
                    callback(err,args);
                } else {
                    new_model(m).update(create_data);
                }

            } else {
                callback(err,args);
            }
        }
        new_model(m).update(create_data);
    }

    create_users(function(err,args){
        if (!err) {
            create_logs(function(err,args){
                if (!err) {
                    create_topics(function(err,args){
                        if (!err) {
                            share_logs(function(err,args){
                                if (!err) {
                                    create_simples_data(function(err,args){
                                        if (!err) {
                                            create_compounds_data(function(err,args){
                                                if (!err) {
                                                    create_modeles_data(function(err,args){
                                                        callback(err,args);
                                                    });
                                                } else {
                                                    callback(err,args)
                                                }
                                            });
                                        } else {
                                            callback(err,args)
                                        }
                                    });
                                } else {
                                    callback(err,args)
                                }
                            });
                        } else {
                            callback(err,args)
                        }
                    });
                } else {
                    callback(err,args)
                }
            });
        } else {
            callback(err,args)
        }
    });
}



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







var SQLITE_DB = require('../libdbj_db_sqlite.js');

var fs = require('fs');

var script = fs.readFileSync('./database_v2.sql', 'utf8');

var sqlite_db = new SQLITE_DB(':memory:');
dao_user = new DT_API.DAO_USER(sqlite_db);
dao_log = new DT_API.DAO_LOG(sqlite_db);
dao_topic = new DT_API.DAO_TOPIC(sqlite_db);
dao_log_user = new DT_API.DAO_LOG_USER(sqlite_db);
dao_data = new DT_API.DAO_DATA(sqlite_db);
sqlite_db.db.exec(script,function(err,args){
    if (!err) {
        full_db(function(err,args){
            console.log(err,args);
        });
    } else {
        console.log(err);
    }
});
