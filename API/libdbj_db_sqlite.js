var sqliteDB = function(database){

    var DB_UTILS = require('./libdbj_db_utils.js');
    this.utils = new DB_UTILS();
    var sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database(database);
    this.DB_TRANSACTION_STATEMENT = require('./libdbj_db_stmt.js');
}

sqliteDB.prototype.insert = function(args,callback){
    var query = this.utils.create(args);
    this.db.run(query.sql,query.params,callback);
}
sqliteDB.prototype.update = function(args,callback){
    var query = this.utils.update(args);
    this.db.run(query.sql,query.params,callback);
}
sqliteDB.prototype.delete = function(args,callback){
    var query = this.utils.delete(args);
    this.db.run(query.sql,query.params,callback);
}
sqliteDB.prototype.select = function(args,callback){
    var query = this.utils.select(args);
    this.db.all(query.sql,query.params,callback);
}

sqliteDB.prototype.select_all = function(args,callback){
    var query = this.utils.select_all(args);
    this.db.all(query.sql,query.params,callback);
}

sqliteDB.prototype.stmt = function(transaction){
    return new this.DB_TRANSACTION_STATEMENT(this.db,this.utils,transaction);
}

module.exports = sqliteDB;
