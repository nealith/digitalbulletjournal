var SQLITE_DB = function(database){

    var DB_UTILS = require('./libdbj_db_utils.js');
    this.utils = new DB_UTILS();
    var sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database(database);
    this.DB_TRANSACTION_STATEMENT = require('./libdbj_db_stmt.js');
}

SQLITE_DB.prototype.insert = function(args,callback){
    var query = this.utils.create(args);
    this.db.run(query.sql,query.params,callback);
}
SQLITE_DB.prototype.update = function(args,callback){
    var query = this.utils.update(args);
    this.db.run(query.sql,query.params,callback);
}
SQLITE_DB.prototype.delete = function(args,callback){
    var query = this.utils.delete(args);
    this.db.run(query.sql,query.params,callback);
}
SQLITE_DB.prototype.select = function(args,callback){
    var query = this.utils.select(args);
    this.db.all(query.sql,query.params,callback);
}

SQLITE_DB.prototype.select_all = function(args,callback){
    var query = this.utils.select_all(args);
    this.db.all(query.sql,query.params,callback);
}

SQLITE_DB.prototype.stmt = function(transaction){
    return new this.DB_TRANSACTION_STATEMENT(this.db,this.utils,transaction);
}

module.exports = SQLITE_DB;
