var sqliteDB = function(database){

    this.sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database('database');

    this.query = db.run;
    this.begin_transaction = function(){
        this.query('BEGIN TRANSACTION');
    }
    this.commit_transaction = function(){
        this.query('COMMIT;');
    }
    this.rollback_transaction = function(){
        this.query('ROLLBACK;');
    }
    this.queries = function(callback){
        this.db.serialize(callback);
    }

}

module.exports = sqliteDB;
