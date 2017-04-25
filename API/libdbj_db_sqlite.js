var sqliteDB = function(database){

    this.utils = require('./libdbj_db_utils.js');
    this.sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database('database');

    var DB_TRANSACTION_STATEMENT = function(db,utils,transaction){

        this.db = db;
        this.utils = utils;
        this.sql = '';
        this.callback = null;
        this.lock = false;
        if (transaction) {
            sql+='BEGIN TRANSACTION;'
        }

    }

    DB_TRANSACTION_STATEMENT.prototype.insert = function (args) {
        if (!lock) {
            var query = this.utils.insert(args);
            var sql = this.utils.to_sql(query);
            this.sql += sql;
        }
    }

    DB_TRANSACTION_STATEMENT.prototype.update = function (args) {
        if (!lock) {
            var query = this.utils.update(args);
            var sql = this.utils.to_sql(query);
            this.sql += sql;
        }
    }

    DB_TRANSACTION_STATEMENT.prototype.delete = function (args) {
        if (!lock) {
            var query = this.utils.delete(args);
            var sql = this.utils.to_sql(query);
            this.sql += sql;
        }
    }

    DB_TRANSACTION_STATEMENT.prototype.select = function (args) {
        if (!lock) {
            var query = this.utils.select(args);
            var sql = this.utils.to_sql(query);
            this.sql += sql;
        }
    }

    DB_TRANSACTION_STATEMENT.prototype.exec = function (callback) {
        if (!lock) {
            lock = true;
            this.callback = callback;
            var callback = this.callback;
            if (transaction) {
                callback = this.finalize;
            }
            this.db.exec(this.sql,callback);
        }
    }
    DB_TRANSACTION_STATEMENT.prototype.finalize = function (err,args) {
        if (lock) {
            if (!err) {
                this.db.run('COMMIT;');
            } else {
                this.db.run('ROLLBACK;');
            }
            this.callback(err,null);
        }
    }


}

this.prototype.insert = function(args,callback){
    var query = this.utils.create(args);
    this.sqlite3.run(query.sql,query.params,callback);
}
this.prototype.update = function(args,callback){
    var query = this.utils.update(args);
    this.sqlite3.run(query.sql,query.params,callback);
}
this.prototype.delete = function(args,callback){
    var query = this.utils.delete(args);
    this.sqlite3.run(query.sql,query.params,callback);
}
this.prototype.select = function(args,callback){
    var query = this.utils.select(args);
    this.sqlite3.all(query.sql,query.params,callback);
}

this.prototype.stmt = function(transaction){
    return new DB_TRANSACTION_STATEMENT(this.db,this.utils,transaction);
}

module.exports = sqliteDB;
