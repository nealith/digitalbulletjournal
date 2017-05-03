var DAO_USER = function(db,id,password,first_name,last_name,nick_name,e_mail){

    this.db = db;
    if(id){
        var self = this;
        this.get(id,function(err,args){
            if (!err) {
                self.id = args.id;
                self.first_name = args.first_name;
                self.password = args.password;
                self.nick_name = args.nick_name;
                self.last_name = args.last_name;
                self.e_mail = args.e_mail;
                self.creation_date = args.creation_date;
            }
        });
    } else {
        this.id = null;
        this.first_name = first_name;
        this.password = password;
        this.nick_name = nick_name;
        this.last_name = last_name;
        this.e_mail = e_mail;
    }

}

DAO_USER.prototype.regen = function (dao) {

    var dao_tmp = new DAO_DATA(this.db,null,dao.password,dao.first_name,dao.last_name,dao.nick_name,dao.e_mail);
    dao_tmp.creation_date = dao.creation_date;
    dao_tmp.id = dao.id;

    return dao_tmp;
}

DAO_USER.prototype.create = function(first_name,password,nick_name,last_name,e_mail,callback,stmt){
    shasum = require('shasum');
    dao = new DAO_DATA(this.db,null,dao.password,dao.first_name,dao.last_name,dao.nick_name,dao.e_mail);
    dao.creation_date = Date.now();
    dao.id = shasum(dao.first_name,dao.last_name,dao.creation_date);
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
            table:'Users',
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

    var dao_log = new DAO_LOG(self.db);
    var dao_log_user = new DAO_LOG_USER(self.db);

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
                stmt.delete({
                    table:'Users',
                    keys:{
                        id:this.id
                    },
                    values:null
                });
                if (finalize) {
                    stmt.exec(callback);
                }
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
            dao_logs[m].delete(recursive_callback_delete_logs,stmt,false);
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
