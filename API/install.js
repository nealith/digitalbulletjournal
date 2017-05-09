var fs = require('fs');
var configuration = JSON.parse(fs.readFileSync('conf.json', 'utf8'));

var DB;
var db;

if (configuration.db.type=='sqlite') {
    DB = require('./libdbj_db_sqlite.js');
    db = new SQLITE_DB(':memory:');
}

var script = fs.readFileSync('./database_v2.sql', 'utf8');

db.db.exec(script,function(err,args){
    if (!err) {
        console.log('API initialization termined')
    } else {
        console.log(err);
    }
});
