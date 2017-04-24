var sqliteDB = function(database){

    this.utils = require('./libdbj_db_utils.js');
    this.sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database('database');

    this.create = function(args,callback){
        var query = this.utils.create(args);
        this.sqlite3.run(query.sql,query.params,callback);
    }
    this.update = function(args,callback){
        var query = this.utils.update(args);
        this.sqlite3.run(query.sql,query.params,callback);
    }
    this.delete = function(args,callback){
        var query = this.utils.delete(args);
        this.sqlite3.run(query.sql,query.params,callback);
    }
    this.select = function(args,callback){
        var query = this.utils.delete(args);
        this.sqlite3.all(query.sql,query.params,callback);
    }
    this.begin_transaction = function(){
        this.sqlite3.run('BEGIN TRANSACTION');
    }
    this.commit_transaction = function(){
        this.sqlite3.run('COMMIT;');
    }
    this.rollback_transaction = function(){
        this.sqlite3.run('ROLLBACK;');
    }
}

module.exports = sqliteDB;
