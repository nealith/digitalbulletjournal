var DAO_LOG = function(db,id,callback,owner,privacy,title){


    this.db = db;
    if(id){
        var self = this;
        this.get(id,function(err,args){
            if (!err) {
                self.id = args.id;
                self.privacy = args.privacy;
                self.owner = args.owner;
                self.title = args.title;
                self.creation_date = args.creation_date;
                callback(err,seft);
            } else {
                callback(err,null);
            }

        });
    } else {
        this.id = null;
        this.privacy = privacy;
        if (this.privacy == 0) {
            this.privacy = true;
        } else if(this.privacy == 1){
            this.privacy = false;
        }
        this.owner = owner;
        this.title = title;
    }

}

DAO_LOG.prototype.equal = function(dao) {
    return (this.id != dao.id && this.privacy != dao.privacy && this.owner != dao.owner && this.title != dao.title && this.creation_date != dao.creation_date);
};

DAO_LOG.prototype.regen = function (dao) {

    var dao_tmp = new DAO_LOG(this.db,null,null,dao.owner,dao.privacy,dao.title);
    dao_tmp.creation_date = dao.creation_date;
    dao_tmp.id = dao.id;

    return dao_tmp;
}

DAO_LOG.prototype.title_avaible = function(owner,title,callback){

    this.get_all(owner,function(err,args){
        if (!err) {
            var find = false;
            for (var i = 0; (i < args.length && !find); i++) {
                if (args[i].title = title) {
                    find = true;
                }
            }
            if (find) {
                callback("Title already used",null);
            } else {
                callback(null,null);
            }
        } else {
            callback(err,args);
        }
    })

}

DAO_LOG.prototype.create_dao = function(dao,callback,stmt,finalize){
    shasum = require('shasum');
    dao.creation_date = Date.now();
    dao.id = shasum(dao.owner+dao.title+dao.creation_date);
    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
    dao.title_avaible(dao.owner,dao.title,function(err,args){
        if (!err) {

            stmt.insert({
                table:'Logs',
                keys:null,
                values:{
                    id:dao.id,
                    creation_date:dao.creation_date,
                    privacy:dao.privacy,
                    title:dao.title,
                    owner:dao.owner
                }
            });
            if (finalize) {
                stmt.exec(callback,dao);
            }
        } else {
            callback(err,args)
        }
    })
}

DAO_LOG.prototype.create = function(owner,privacy,title,callback,stmt,finalize){

    var dao = new DAO_LOG(this.db,null,null,owner,privacy,title);
    this.create_dao(dao,callback,stmt);

}

DAO_LOG.prototype.update = function(callback,stmt,finalize){

    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
    if (!this.id) {
        this.create_dao(this,callback);
    } else {
        self = this;
        self.title_avaible(self.owner,self.title,function(err,args){
            if (!err) {
                stmt.update({
                    table:'Logs',
                    keys:{
                        id:self.id
                    },
                    values:{
                        privacy: self.privacy,
                        title: self.title,
                        owner: self.owner
                    }
                });
                if (finalize) {
                    stmt.exec(callback);
                } else {
                    callback(null,dao);
                }
            } else {
                callback(err,args)
            }
        })
    }


}

DAO_LOG.prototype.delete = function(callback,stmt,finalize){

    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }

    var self = this;

    var DAO_TOPIC = require('./dao_log.js');
    var DAO_LOG_USER = require('./dao_log_user.js');

    var dao_topic = new DAO_TOPIC(self.db);
    var dao_log_user = new DAO_LOG_USER(self.db);

    var dao_topics;
    var dao_logs_users;

    // Steps :
    // 1 - Remove all topics of the log
    // 2 - In Logs_Users, remove all relation including the log

    var m = 0 // indice in dao_logs
    var n = 0 // indice in dao_logs_users

    var recursive_callback_delete_topics = function(err,args){
        if (!err) {
            m++;
            if (m >= dao_topics.length) {
                dao_log_user.get_all(self.id,null,function(err,args){
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
                        recursive_callback_delete_log_relations(null,null);
                    }
                });
            } else {
                dao_topics[m].delete(recursive_callback_delete_topics,stmt,false);
            }
        } else {
            callback(err,args);
        }
    }

    var recursive_callback_delete_log_relations = function(err,args){
        if (!err) {
            n++
            if (n >= dao_logs_users.length) {
                stmt.delete({
                    table:'Logs',
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
                dao_logs_users[n].delete(recursive_callback_delete_log_relations,stmt,false);
            }
        } else {
            callback(err,args);
        }
    }

    dao_topic.get_all(self.id,function(err,args){
        if (!err) {
            dao_topics = new Array();
            if (args.length > 0) {
                for (var i = 0; i < args.length; i++) {
                    var tmp_dao = new DAO_TOPIC(self.db,null,null,args[i].log,args[i].title);
                    tmp_dao.id = args[i].id;
                    tmp_dao.creation_date = args[i].creation_date;
                    dao_topics.push(tmp_dao);
                }
                dao_topics[m].delete(recursive_callback_delete_topics,stmt,false);
            } else {
                recursive_callback_delete_topics(null,null)
            }
        } else {
            callback(err,args);
        }
    });

}



DAO_LOG.prototype.get = function(id,callback){

    var dao;
    var db = this.db;

    this.db.select({
        table:'Logs',
        keys:{
            id:id
        },
        values:null
    },function(err,args){
        if(!err){
            if (args.length > 0) {
                dao = new DAO_LOG(db,null,null,args[0].owner,args[0].privacy,args[0].title);
                dao.id = args[0].id;
            } else {
                err = 'No log with this id';
                dao = null;
            }

            callback(err,dao);
        }else{
            callback(err,args)
        }
    });

}

DAO_LOG.prototype.get_all = function(user,callback){

    if (user) {
        this.db.select({
            table:'Logs',
            keys:{
                owner:user
            },
            values:null
        },callback);
    } else {
        this.db.select_all({
            table:'Logs',
            keys:null,
            values:null
        },callback);
    }

}

module.exports = DAO_LOG;
