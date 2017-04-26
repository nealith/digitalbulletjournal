var DB_TRANSACTION_STATEMENT = function(db,utils,transaction){

    this.db = db;
    this.utils = utils;
    this.sql = '';
    this.callback = null;
    this.lock = false;
    this.transaction = transaction;
    if (transaction) {
        this.sql+='BEGIN TRANSACTION;'
    }

}

DB_TRANSACTION_STATEMENT.prototype.insert = function (args) {
    if (!this.lock) {

        var query = this.utils.insert(args);
        var sql = this.utils.to_sql(query);
        this.sql += sql;
    }
}

DB_TRANSACTION_STATEMENT.prototype.update = function (args) {
    if (!this.lock) {
        var query = this.utils.update(args);
        var sql = this.utils.to_sql(query);
        this.sql += sql;
    }
}

DB_TRANSACTION_STATEMENT.prototype.delete = function (args) {
    if (!this.lock) {
        var query = this.utils.delete(args);
        var sql = this.utils.to_sql(query);
        this.sql += sql;
    }
}

DB_TRANSACTION_STATEMENT.prototype.select = function (args) {
    if (!this.lock) {
        var query = this.utils.select(args);
        var sql = this.utils.to_sql(query);
        this.sql += sql;
    }
}

DB_TRANSACTION_STATEMENT.prototype.exec = function (callback) {
    if (!this.lock) {
        this.lock = true;
        this.callback = callback;
        if (this.transaction) {
            var self = this;
            this.db.exec(this.sql,function(err,args){
                if (self.lock) {
                    if (!err) {
                        self.db.run('COMMIT;');
                    } else {
                        self.db.run('ROLLBACK;');
                    }
                    self.callback(err,args);
                }
            });
        } else {
            this.db.exec(this.sql,this.callback);
        }

    }
}
DB_TRANSACTION_STATEMENT.prototype.finalize = function (err,args) {
    console.log(this.stmt.lock);
    console.log(this.stmt.callback);
    console.log(this.stmt.db);
    console.log(err);

}

module.exports = DB_TRANSACTION_STATEMENT;
