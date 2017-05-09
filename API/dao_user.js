var DAO_USER = function(db,id,callback,first_name,last_name,password,nick_name,e_mail){

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
                callback(err,seft);
            } else {
                callback(err,null);
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

DAO_USER.prototype.equal = function(dao) {
    return (this.id == dao.id && this.first_name == dao.first_name && this.password == dao.password && this.nick_name == dao.nick_name && this.last_name == dao.last_name && this.e_mail == dao.e_mail && this.creation_date == dao.creation_date);
};

DAO_USER.prototype.regen = function (dao) {

    var dao_tmp = new DAO_USER(this.db,null,null,dao.first_name,dao.last_name,dao.password,dao.nick_name,dao.e_mail);
    dao_tmp.creation_date = dao.creation_date;
    dao_tmp.id = dao.id;

    return dao_tmp;
}

DAO_USER.prototype.create_dao = function(dao,callback,stmt){
    shasum = require('shasum');
    dao.creation_date = Date.now();
    dao.id = shasum(dao.first_name+dao.last_name+dao.creation_date);
    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
    stmt.insert({
        table:'Users',
        keys:null,
        values:{
            id:dao.id,
            creation_date:dao.creation_date,
            first_name:dao.first_name,
            last_name:dao.last_name,
            nick_name:dao.nick_name,
            e_mail:dao.e_mail,
            password:dao.password
        }
    });
    if (finalize) {
        stmt.exec(callback,dao);
    }
}

DAO_USER.prototype.create = function(first_name,last_name,password,nick_name,e_mail,callback,stmt){

    var dao = new DAO_USER(this.db,null,null,first_name,last_name,password,nick_name,e_mail);
    this.create_dao(dao,callback,stmt);

}

DAO_USER.prototype.update = function(callback,stmt,finalize){

    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
    if (!this.id) {
        this.create_dao(this,callback,stmt);
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
    } else {
        callback(null,dao);
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
            if (m >= dao_logs.length) {
                dao_log_user.get_all(self.id,null,function(err,args){
                    if (!err) {
                        dao_logs_users = new Array();
                        if (args.length>0) {
                            for (var i = 0; i < args.length; i++) {
                                var tmp_dao = new DAO_LOG_USER(self.db,null,null,null,args[i].writting_rights,args[i].admin_rights);
                                tmp_dao.user = args[i].user;
                                tmp_dao.log = args[i].log;
                                tmp_dao.adding_date = args[i].adding_date;
                                dao_logs_users.push(tmp_dao);
                            }
                            dao_logs_users[n].delete(recursive_callback_delete_user_relations,stmt,false);
                        } else {
                            recursive_callback_delete_user_relations(null,null);
                        }

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
            if (n >= dao_logs_users.length) {
                stmt.delete({
                    table:'Users',
                    keys:{
                        id:self.id
                    },
                    values:null
                });
                if (finalize) {
                    stmt.exec(callback);
                } else {
                    callback(null,null);
                }
            } else {
                dao_logs_users[n].delete(recursive_callback_delete_user_relations,stmt,false);
            }
        } else {
            callback(err,args);
        }
    }

    dao_log.get_all(self.id,function(err,args){
        if (!err) {
            dao_logs = new Array();
            if (args.length > 0) {

                for (var i = 0; i < args.length; i++) {
                    var tmp_dao = new DAO_LOG(self.db,null,null,args[i].owner,args[i].privacy,args[i].title);
                    tmp_dao.id = args[i].id;
                    tmp_dao.creation_date = args[i].creation_date;
                    dao_logs.push(tmp_dao);
                }
                dao_logs[m].delete(recursive_callback_delete_logs,stmt,false);
            } else {
                recursive_callback_delete_logs(null,null);
            }

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
            if (args.length>0) {
                dao = new DAO_USER(db,null,null,args[0].first_name,args[0].last_name,args[0].password,args[0].nick_name,args[0].e_mail);
                dao.id = args[0].id;
                dao.creation_date = args[0].creation_date;
            } else {
                err = 'No user with this id';
                dao = null;
            }
            callback(err,dao);
        }else{
            callback(err,args)
        }
    });

}

DAO_USER.prototype.get_all = function(callback){
    this.db.select_all({
        table:'Users',
        keys:null,
        values:null
    },callback);
}

module.exports = DAO_USER;
