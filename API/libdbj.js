/*  INTERFACE DB
 *
 *  query(sql, [param, ...], [callback])
 *  begin_transaction()
 *  commit_transaction()
 *  rollback_transaction()
 *  queries(callback)
 */


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

var dbjDB = function(db){

    this.db = db;
    //this.all_queries = JSON.parse(fs.readFileSync('queries.json', 'utf8'));
    this.data = require('./libdbj_data.js');
    this.ult = require('./libdbj_ult.js');
    this.utils = require('./libdbj_utils.js');

}
