var run_count = 0;
var fail_count = 0;

function to_run(test,fonction_to_run){
    succes = fonction_to_run();
    var suc = 'SUCCES';
    var fai = 'FAIL';

    run_count++;

    var result = '';
    if (succes) {
        result = suc;
    } else {
        result = fai;
        fail_count++;
    }

    console.log(test,result);


}

function end_test(message){
    console.log(message);
    console.log('Tests run : ',run_count);
    console.log('Tests succes : ',(run_count-fail_count));
    console.log('Tests run : ',fail_count);
    run_count = 0;
    fail_count = 0;

}

function run_test_on(db){

    var dao_user = new DT_API.DAO_USER(db);
    var dao_log = new DT_API.DAO_LOG(db);
    var dao_topic = new DT_API.DAO_TOPIC(db);
    var dao_log_user = new DT_API.DAO_LOG_USER(db);
    var dao_data = new DT_API.DAO_DATA(db);

    // USER TESTS

    var users = new Array();

    for (var i = 0; i < 5; i++) {
        users.push(
            {
                first_name: 'user'+i,
                password: 'user'+i,
                nick_name: 'user'+i,
                last_name: 'user'+i,
                e_mail: 'user'+i
            }
        );
    }

    dao_user.create(users[0].first_name, users[0].password, users[0].nick_name, users[0].last_name, users[0].e_mail,function(err,args){
        to_run('create user with create()',function(){
            if (!err) {
                if (users[0].first_name == args.first_name && users[0].password == args.password && users[0].nick_name == args.nick_name && users[0].last_name == args.last_name && users[0].e_mail == args.e_mail) {
                    return true;
                }
            } else {
                return false;
            }

        })

    });

    // LOG TESTS

    // LOG_USER TESTS

    // TOPIC TESTS

    // DATA TESTS

    // DATA COMPLEXE TESTS

    // DATA MODEL TESTS


    end_test('TESTS ON SQLITE DB');

}

var DT_API = require('../api.js');

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
