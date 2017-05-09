var MYSQL_DB = function(database){

    var DB_UTILS = require('./libdbj_db_utils.js');
    this.utils = new DB_UTILS();
    var mysql = require('mysql');
    this.db = mysql.createConnection(database);
    this.DB_TRANSACTION_STATEMENT = require('./libdbj_db_stmt.js');

    this.db.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\$(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty('$'+key)) {
                return this.escape(values['$'+key]);
            }
            return txt;
        }.bind(this));
    };

    this.db.run = function (sql,params,callback) {
        this.db.connect();

        this.db.query(sql,params,callback);

        this.db.end();
    }

    this.db.all = this.db.run;
    this.db.exec = function(sql,callback){
        this.db.connect({multipleStatements: true});

        this.db.query(sql,callback);

        this.db.end();
    }

}

MYSQL_DB.prototype.insert = function(args,callback){
    var query = this.utils.create(args);
    this.db.run(query.sql,query.params,callback);
}
MYSQL_DB.prototype.update = function(args,callback){
    var query = this.utils.update(args);
    this.db.run(query.sql,query.params,callback);
}
MYSQL_DB.prototype.delete = function(args,callback){
    var query = this.utils.delete(args);
    this.db.run(query.sql,query.params,callback);
}
MYSQL_DB.prototype.select = function(args,callback){
    var query = this.utils.select(args);
    this.db.all(query.sql,query.params,callback);
}

MYSQL_DB.prototype.select_all = function(args,callback){
    var query = this.utils.select_all(args);
    this.db.all(query.sql,callback);
}

MYSQL_DB.prototype.stmt = function(transaction){
    return new this.DB_TRANSACTION_STATEMENT(this.db,this.utils,transaction);
}

module.exports = MYSQL_DB;
