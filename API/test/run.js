var DT_API = require('../api.js');



var dao_user;
var dao_log;
var dao_topic;
var dao_log_user;
var dao_data;

var TEST = function(name,test){
    this.test_callback;
    var self = this;
    this.result = function(err,args){
        if (!err) {
            console.log(name,args);
        } else {
            console.log(name,err);
        }
        self.test_callback(err,args);
    }
    this.exec = function(args,callback){
        self.test_callback = callback;
        test(args,self.result);
    }
}

var TESTS = function(name,tests,pre,callback){
    var run_count = tests.length;
    var fail_count = 0;
    var err_count = 0;

    var m = 0;

    var next = function(err,args){
        if (!err) {
            if (args) {

            } else {
                fail_count++;
            }
        } else {
            err_count++;
        }

        m++;
        if (m == tests.length-1) {
            pre(function(err,args){
                if(!err){
                    tests[m].exec(args,result);
                } else {
                    callback('err with pre function',null);
                }
            });
        } else {
            pre(function(err,args){
                if(!err){
                    tests[m].exec(args,next);
                } else {
                    callback('err with pre function',null);
                }
            });
        }


    }

    var result = function(err,args){
        if (!err) {
            if (args) {

            } else {
                fail_count++;
            }
        } else {
            err_count++;
        }

        console.log(name);
        console.log('tests run :',run_count);
        console.log('tests sucess :',run_count-fail_count-err_count);
        console.log('tests fail :',fail_count);
        console.log('tests errors :',err_count);

        callback();
    }

    if (tests.length == 1) {
        pre(function(err,args){
            if(!err){
                tests[m].exec(args,result);
            } else {
                callback('err with pre function',null);
            }
        });

    } else {
        pre(function(err,args){
            if(!err){
                tests[m].exec(args,next);
            } else {
                callback('err with pre function',null);
            }
        });

    }



}

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
        var m = 2;
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
        dao_log_user.create(users[1].id,logs[2].id,
        true,true,function(err,args){
            dao_log_user.create(users[2].id,logs[2].id,
            true,true,callback);
        })
    }

    // Create topics

    var topics = new Array();

    function create_topics(callback){
        var m = 2;
        var n = 5;
        function create_topic(err,args){
            if (!err) {
                topics.push(args);
                m++;
                if (m == n) {
                    callback(err,args);
                } else {
                    dao_topic.create(logs[m-2].id,'title'+m,create_topic);
                }

            } else {
                callback(err,args);
            }
        }
        dao_topic.create(logs[m-2].id,'title'+m,create_topic);
    }

    // Create simples data

    var data = new Array();

    function create_simples_data(callback){
        var m = 2;
        var n = 5;
        function create_data(err,args){
            if (!err) {
                data.push(args);
                m++;
                if (m == n) {
                    callback(err,args);
                } else {
                    dao_data.create(topics[m-2].id,users[m].id,'Text','lol'+m,create_data);
                }

            } else {
                callback(err,args);
            }
        }
        dao_data.create(topics[m-2].id,users[m].id,'Text','test'+m,create_data);
    }

    // Create compound data

    function create_compounds_data(callback){
        var m = 2;
        var n = 5;


        function new_composite(no){
            var value = new Object();

            for (var i = 0; i < 5; i++) {
                value['t'+i] = new DT_API.DAO_DATA(dao_data.db,null,null,topics[m-2].id,users[m].id,'Text','test_c'+i,null);
            }

            if (no < m) {
                value['t5'] = new_composite(5);
            }

            var dao = new DT_API.DAO_DATA(dao_data.db,null,null,topics[m-2].id,users[m].id,'Compound',value,null);
            return dao;
        }

        function create_data(err,args){
            if (!err) {
                m++;
                if (m == n) {
                    callback(err,args);
                } else {

                    data.push(new_composite(m));
                    data[data.length-1].update(create_data);
                }

            } else {
                callback(err,args);
            }
        }
        data.push(new_composite(m));
        data[data.length-1].update(create_data);
    }

    // Create models data

    function create_models_data(callback){
        var m = 2;
        var n = 5;

        function new_model(no){
            var value = new Object();

            for (var j = 0; j < 5; j++) {
                value['s'+j] = new Array();
                for (var i = 0; i < 5; i++) {
                    value['s'+j][+i] = new DT_API.DAO_DATA(dao_data.db,null,null,topics[m-2].id,users[m].id,'Text','test_c'+i,null);
                }
                if (no < m) {
                    value['s'+j][5] = new_composite(5);
                }

            }
            var dao = new DT_API.DAO_DATA(dao_data.db,null,null,topics[m-2].id,users[m].id,'Model',value,null);

            return dao;
        }

        function create_data(err,args){
            if (!err) {
                m++;
                if (m == n) {
                    callback(err,args);
                } else {
                    data.push(new_model(m));
                    data[data.length-1].update(create_data);
                }

            } else {
                callback(err,args);
            }
        }
        data.push(new_model(m));
        data[data.length-1].update(create_data);
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
                                                    create_models_data(function(err,args){
                                                        callback(err,{users:users,logs:logs,topics:topics});
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

    function create_user(args,callback){
        var user;
        dao_user.create('toto','toto','toto','toto','toto'+'@users.com',function(err,args){
            if (!err) {
                user = args;
                dao_user.get(user.id,function(err,args){
                    if (!err) {
                        if (user.equal(args)) {
                            report('Create a user with create()',true);
                        } else {
                            report('Create a user with create()',false);
                        }
                    } else {
                        callback(err,args);
                    }
                })
            } else {
                callback(err,args);
            }
        })

    }

    // Create a user with new() and create_dao()

    function create_user_dao(args,callback){
        var user = new DT_API.DAO_USER(dao_user.db,null,null,'toto','toto','toto','toto','toto'+'@users.com');
        dao_user.create_dao(user,function(err,args){
            user = args;
            if (!err) {
                dao_user.get(user.id,function(err,args){
                    if (!err) {
                        if (user.equal(args)) {
                            callback(err,true);
                        } else {
                            callback(err,false);
                        }
                    } else {
                        callback(err,args);
                    }
                })
            } else {
                callback(err,args);
            }
        })

    }

    // Create a user with new() and update()

    function create_user_update(args,callback){
        var user = new DT_API.DAO_USER(dao_user.db,null,null,'toto','toto','toto','toto','toto'+'@users.com');
        user.update(function(err,args){
            if (!err) {
                dao_user.get(user.id,function(err,args){
                    if (!err) {
                        if (user.equal(args)) {
                            callback(err,true);
                        } else {
                            callback(err,false);
                        }
                    } else {
                        callback(err,args);
                    }
                })
            } else {
                callback(err,args);
            }
        })

    }

    // Delete a user without log and without shared log

    function delete_user(args,callback){
        var users = args.users;
        dao_user.delete(function(err,args){
            if (!err) {
                dao_user.get(users[0].id,function(err,args){
                    if (err) {
                        callback(null,true);
                    } else {
                        callback(err,args);
                    }
                })
            } else {
                callback(err,args);
            }
        })
    }

    // Delete a user with log and and without shared log

    function delete_shared_log(args,callback){
        var users = args.users;
        var logs = args.logs;
        users[3].delete(function(err,args){
            if (!err) {
                dao_user.get(users[3].id,function(err,args){
                    if (err) {
                        dao_log.get(logs[1].id,function(err,args){
                            if(err){
                                callback(null,true);
                            } else {
                                callback('is in DB',args);
                            }
                        })
                    } else {
                        callback('is in DB',args);
                    }
                })
            } else {
                callback(err,args);
            }
        })
    }

    // Delete a user with shared log and without log

    function delete_shared_log(args,callback){
        var users = args.users;
        var logs = args.logs;
        dao_user.delete(function(err,args){
            if (!err) {
                dao_user.get(users[1].id,function(err,args){
                    if (err) {
                        dao_log_user.get(users[1].id,logs[2].id,function(err,args){
                            if(err){
                                callback(null,true);
                            } else {
                                callback('is in DB',args);
                            }
                        })
                    } else {
                        callback('is in DB',args);
                    }
                })
            } else {
                callback(err,args);
            }
        })
    }

    // Delete a user with shared log and log

    function delete_user_log_shared_log(args,callback){
        var users = args.users;
        var logs = args.logs;
        dao_user.delete(function(err,args){
            if (!err) {
                dao_user.get(users[2].id,function(err,args){
                    if (err) {
                        dao_log_user.get(users[2].id,logs[2].id,function(err,args){
                            if(err){
                                dao_log.get(logs[2].id,function(err,args){
                                    if(err){
                                        callback(null,true);
                                    } else {
                                        callback('is in DB',args);
                                    }
                                })
                            } else {
                                callback('is in DB',args);
                            }
                        })
                    } else {
                        callback('is in DB',args);
                    }
                })
            } else {
                callback(err,args);
            }
        })
    }

    // Update a user

    function update_user(args,callback){
        var users= args.users;
        users[0].first_name='toto33';
        users[0].update(function(err,args){
            if (!err) {
                dao_user.get(users[0].id,function(err,agrs){
                    if (!err) {
                        if (users[0].equal(args)) {
                            callback(err,true);
                        } else {
                            callback(err,false);
                        }
                    } else {
                        callback(err,args);
                    }
                })
            } else {
                callback(err,args);
            }
        })
    }


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
            var tests = new TESTS('test sqlite',[
                new TEST('Create a user with create()',create_user),
                new TEST('Create a user with new() and create_dao()',create_user_dao),
                new TEST('Create a user with new() and update()',create_user_update),
                new TEST('Delete a user without log and without shared log',delete_user),
                new TEST('Delete a user with log and and without shared log',delete_shared_log),
                new TEST('Delete a user with shared log and without log',delete_shared_log),
                new TEST('Delete a user with shared log and log',delete_user_log_shared_log),
                new TEST('Update a user',update_user)
            ],function(callback){
                sqlite_db.db.exec(script,function(err,args){
                    full_db(callback);
                });
            },function(){
                console.log('the end');
            })
        });
    } else {
        console.log(err);

    }

});
