var SQLITE_DB = function(database){

    var DB_UTILS = require('./libdbj_db_utils.js');
    this.utils = new DB_UTILS();
    var sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database(database);
    this.DB_TRANSACTION_STATEMENT = require('./libdbj_db_stmt.js');

    this.Bool2Int = function(bool){
        if (bool) {
            return 0;
        } else {
            return 1;
        }
    }

    this.convertArgs2sqlite = function(args){
        for (key in args.keys) {
            if (typeof args.keys[key] == 'boolean') {
                args.keys[key] = this.Bool2Int(args.keys[key]);
            }
        }
        for (value in args.values) {
            if (typeof args.values[value] == 'boolean') {
                args.values[value] = this.Bool2Int(args.values[value]);
            }
        }
    }

    var self = this;

    self.utils._insert =  self.utils.insert;
    self.utils._update =  self.utils.update;
    self.utils._delete =  self.utils.delete;
    self.utils._select =  self.utils.select;

    self.utils.insert = function(args){
        self.convertArgs2sqlite(args);
        return self.utils._insert(args);
    };
    self.utils.update = function(args){
        self.convertArgs2sqlite(args);
        return self.utils._update(args);
    };
    self.utils.delete = function(args){
        self.convertArgs2sqlite(args);
        return self.utils._delete(args);
    };
    self.utils.select = function(args){
        self.convertArgs2sqlite(args);
        return self.utils._select(args);
    };
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

    return new  this.DB_TRANSACTION_STATEMENT(this.db,this.utils,transaction);
}

module.exports = SQLITE_DB;
