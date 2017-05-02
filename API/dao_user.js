var DAO_USER = function(db,id,password,first_name,last_name,nick_name,e_mail){

    this.db = db;
    if(id){
        this.get(id,this.erase);
    } else {
        this.id = null;
        this.first_name = first_name;
        this.password = password;
        this.nick_name = nick_name;
        this.last_name = last_name;
        this.e_mail = e_mail;
    }

}

DAO_USER.prototype.erase = function (err,dao) {
    if (!err) {
        this.id = this.id;
        this.first_name = dao.first_name;
        this.last_name = dao.last_name;
        this.nick_name = dao.nick_name;
        this.creation_date = dao.creation_date;
        this.e_mail = dao.e_mail;
    }
}

DAO_USER.prototype.create = function(first_name,password,nick_name,last_name,e_mail,callback,stmt){

    dao = new DAO_USER(this.db);
    dao.callback = callback;
    dao.creation_date = Date.now();
    dao.first_name = first_name;
    dao.last_name = last_name;
    dao.nick_name = nick_name;
    dao.password = password;
    dao.e_mail = e_mail;
    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
    stmt.insert({
        table:'Users',
        keys:null,
        values:{
            creation_date:dao.creation_date,
            first_name:dao.first_name,
            last_name:dao.last_name,
            nick_name:dao.nick_name,
            e_mail:dao.e_mail,
            password:dao.password
        }
    });
    if (finalize) {
        stmt.exec(callback);
    }
}

DAO_USER.prototype.update = function(callback,stmt,finalize){

    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
    if (!this.id) {
        this.create(this,callback,stmt);
    } else {
        stmt.update({
            table:'Data',
            keys:{
                id:this.id
            },
            values:{
                first_name: this.first_name,
                last_name: this.last_name,
                nick_name: this.nick_name,
                e_mail: this.e_mail,
                password: this.password
            }
        });
    }
    if (finalize) {
        stmt.exec(callback);
    }


}

DAO_USER.prototype.delete = function(callback,stmt,finalize){

    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }

    var self = this;

    var DAO_LOG = require('./dao_log.js');
    var DAO_LOG_USER = require('./dao_log_user.js');

    var dao_log = new DAO_LOG();
    var dao_log_user = new DAO_LOG_USER();

    var i = 0;
    var l = 0;

    var dao_logs;
    var dao_logs_users;

    // Steps :
    // 1 - Remove all logs of the user (they will remove them self in logs_users)
    // 2 - In Logs_Users, remove all relation including the user

    var m = 0 // indice in dao_logs
    var n = 0 // indice in dao_logs_users

    var recursive_callback_delete_logs = function(err,args){
        if (!err) {
            m++;
            if (m == dao_logs.length) {
                dao_log_user.get_all_user(self.id,function(err,args){
                    if (!err) {
                        dao_logs_users = args
                        dao_logs_users[n].delete(recursive_callback_delete_user_relations,stmt,false);
                    } else {
                        callback(err,args);
                    }
                });
            } else {
                dao_logs[m].delete(recursive_callback_delete_logs,stmt,false);
            }
        } else {
            callback(err,args);
        }
    }

    var recursive_callback_delete_user_relations = function(err,args){
        if (!err) {
            n++
            if (n == dao_logs_users.length) {
                callback(err,args);
            } else {
                dao_logs_users[n].delete(recursive_callback_delete_user_relations,stmt,false);
            }
        } else {
            callback(err,args);
        }
    }

    dao_log.get_all_user(self.id,function(err,args){
        if (!err) {
            dao_logs = args
            dao_logs[m].delete(recursive_callback_delete_logs,stmt,stmt,false);
        } else {
            callback(err,args);
        }
    });
}



DAO_USER.prototype.get = function(id,callback){

    var dao;
    var db = this.db;

    this.db.select({
        table:'Users',
        keys:{
            id:id
        },
        values:null
    },function(err,args){
        if(!err){
            dao = new DAO_USER(db,null,args[0].password,args[0].first_name,args[0].last_name,args[0].nick_name,args[0].e_mail);
            dao.id = args[0].id;
            callback(err,dao);
        }else{
            callback(err,args)
        }
    });

}

module.exports = DAO_USER;
