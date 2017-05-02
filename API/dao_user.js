var DAO_USER = function(db,id,first_name,password,nick_name,last_name,e_mail){

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
    var DAO_LOG_TOPIC = require('./dao_topic.js');

    var dao_log = new DAO_LOG();
    var dao_log_user = new DAO_LOG_USER();

    var i = 0;
    var l = 0;

    var dao_logs;
    var dao_logs_users;
    dao_log.get_all_user(self.id,function(err,args){
        dao_logs = args;

        var recursif_callback_delete_log = function(err,args){
            if (!err) {
                if (l < dao_logs.length) {
                    l++;
                    dao_logs[l].delete(recursif_callback_delete_log,stmt,false)
                } else {
                    if (finalize) {
                        stmt.exec(callback);
                    }
                }
            } else {
                callback(err,args);
            }
        }

        var recursif_callback_get_log = function(err,args){
            if (!err) {
                if (i < dao_logs.length) {
                    dao_logs_users = dao_logs_users.concat(args);
                    i++; dao_log_user.get_all_log(dao_logs[i].id,recursif_callback_get_log);
                } else {
                    dao_log_user.get_all_user(self.id,function(err,args){
                        if (!err) {
                            dao_logs_users = dao_logs_users.concat(args)
                            for (var k = 0; k < array.length; k++) {
                                dao_log_user[k].delete(null,stmt,false);
                            }
                        } else {
                            callback(err,args);
                        }
                    });
                }
            } else {
                callback(err,args);
            }


        }

        dao_log_user.get_all_log(dao_logs[i].id,recursif_callback_get_log);
    });



}



DAO_USER.prototype.get = function(id,callback){

    var dao = new DAO_USER(this.db);
    dao.callback = callback
    dao.lock = true;

    this.db.select({
        table:'Users',
        keys:{
            id:id
        },
        values:null
    },function(err,args){
        if(args){
            dao.id = args[0].id;
            dao.first_name = args[0].first_name;
            dao.last_name = args[0].last_name;
            dao.nick_name = args[0].nick_name;
            dao.creation_date = args[0].creation_date;
            dao.e_mail = args[0].e_mail;
            callback(null,dao);
        }else{
            dao.lock = false;
            callback(err,null)
        }
    });

}

module.exports = DAO_USER;
