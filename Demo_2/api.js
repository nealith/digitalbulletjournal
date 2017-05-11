var fs = require('fs');
var configuration = JSON.parse(fs.readFileSync('conf.json', 'utf8'));

var DB;
var db;

if (configuration.db.type=='sqlite') {
    DB = require('./libdbj_db_sqlite.js');
    db = new DB(configuration.db.sqlite.path);
}


var DT_API = new Object();
DT_API.DAO_USER = require('./dao_user.js');
DT_API.DAO_LOG = require('./dao_log.js');
DT_API.DAO_TOPIC = require('./dao_topic.js');
DT_API.DAO_LOG_USER = require('./dao_log_user.js');
DT_API.DAO_DATA = require('./dao_data.js');
DT_API.DB = db;

module.exports = DT_API;
