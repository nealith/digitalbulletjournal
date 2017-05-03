var DAO_LOG_USER = function(db,user,log,writting_rights,admin_rights){

    this.db = db;
    if(user && log){
        var self = this;
        this.get(user,log,function(err,args){
            if (!err) {
                self.user = args.user;
                self.writting_rights = args.writting_rights;
                self.log = args.log;
                self.admin_rights = args.admin_rights;
                self.adding_date = args.adding_date;
                self.is_create = true;
            }
        });
    } else {
        this.user = null;
        this.writting_rights = writting_rights;
        this.log = null;
        this.admin_rights = admin_rights;
        this.is_create = false;
    }

}

DAO_LOG_USER.prototype.regen = function (dao) {

    var dao_tmp = new DAO_DATA(this.db,null,dao.log,dao.writting_rights,dao.admin_rights);
    dao_tmp.adding_date = dao.adding_date;
    dao_tmp.user = dao.user;

    return dao_tmp;
}

DAO_LOG_USER.prototype.create = function(writting_rights,user,log,admin_rights,callback,stmt){
    dao = new DAO_DATA(this.db,null,dao.log,dao.writting_rights,dao.admin_rights);
    dao.adding_date = Date.now();
    dao.log=log;
    dao.user=user;
    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }

    stmt.insert({
        table:'Logs_Users',
        keys:null,
        values:{
            adding_date:dao.adding_date,
            writting_rights:dao.writting_rights,
            admin_rights:dao.admin_rights,
            log:dao.log
        }
    });
    if (finalize) {
        stmt.exec(callback);
    }




}

DAO_LOG_USER.prototype.update = function(callback,stmt,finalize){

    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
    if (!this.is_create) {
        this.is_create = true;
        this.create(this,callback,stmt);
    } else {
        self = this;

        stmt.update({
            table:'Logs_Users',
            keys:{
                user:self.user,
                log:self.log
            },
            values:{
                writting_rights: self.writting_rights,
                admin_rights: self.admin_rights,
            }
        });


    }
    if (finalize) {
        stmt.exec(callback);
    }

}

DAO_LOG_USER.prototype.delete = function(callback,stmt,finalize){

    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }

    var self = this;

    var DAO_LOG = require('./dao_log.js');
    var DAO_TOPIC = require('./dao_topic.js');
    var DAO_DATA = require('./dao_data.js');

    var dao_data = new DAO_DATA(self.db);
    var dao_topic = new DAO_TOPIC(self.db);
    var dao_log = new DAO_LOG(self.db);
    var log;

    var all_data;
    var all_topics;

    // 1 - list all data linked to the topic
    // 2 - for all data, create the dao, call delete

    var m = 0 // data m
    var n = 0 // topic n

    var recursive_callback_update_data;

    var recursive_callback_update_topic = function(){
        if (!err) {
            n++;
            if (n == all_topics.length) {
                if (finalize) {
                    stmt.exec(callback);
                }
            } else {
            m = 0;
                dao_data.get_all_topic(all_topics[n],null,function(err,args){
                    if (!err) {
                        all_data = args;
                        // Launch call on recursive_callback_delete_data
                        dao_data.get(all_data[m],function(err,args){
                            if (!err) {
                                args.user = log.owner;
                                args.update(recursive_callback_update_data,stmt,false);
                            } else {
                                callback(err,args);
                            }
                        });
                    } else {
                        callback(err,args);
                    }
                });
            }
        } else {
            callback(err,args);
        }
    }

    recursive_callback_update_data = function(err,args){
        if (!err) {
            m++;
            if (m == all_data.length) {
                recursive_callback_update_topic();
            } else {
                dao_data.get(all_data[m],function(err,args){
                    if (!err) {
                        args.user = log.owner;
                        args.update(recursive_callback_update_data,stmt,false);
                    } else {
                        callback(err,args);
                    }
                });
            }
        } else {
            callback(err,args);
        }
    }

    dao_log.get(self.log,function(err,args){
        if (!err) {
            log = args;
            dao_topic.get_all_log(self.log,function(err,args){
                if (!err) {
                    all_topics = args;
                    recursive_callback_update_topic();
                } else {
                    callback(err,args);
                }
            });
        } else {
            callback(err,args);
        }
    })

}



DAO_LOG_USER.prototype.get = function(user,log,callback){

    var dao;
    var db = this.db;

    this.db.select({
        table:'Users',
        keys:{
            user:user,
            log:log
        },
        values:null
    },function(err,args){
        if(!err){
            dao = new DAO_LOG_USER(db,null,null,args[0].writting_rights,args[0].admin_rights);
            dao.user = args[0].user;
            dao.log = args[0].log
            callback(err,dao);
        }else{
            callback(err,args)
        }
    });

}

DAO_LOG_USER.prototype.get_all_user = function(id,callback){

    this.db.select({
        table:'Logs_Users',
        keys:{
            user:id
        },
        values:null
    },callback);

}

DAO_LOG_USER.prototype.get_all_log = function(id,callback){

    this.db.select({
        table:'Logs_Users',
        keys:{
            log:id
        },
        values:null
    },callback);

}

module.exports = DAO_LOG_USER;
