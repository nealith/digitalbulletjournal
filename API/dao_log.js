var DAO_LOG = function(db,id,owner,privacy,title){


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
            }
        });
    } else {
        this.id = null;
        this.privacy = privacy;
        this.owner = owner;
        this.title = title;
    }

}

DAO_LOG.prototype.regen = function (dao) {

    var dao_tmp = new DAO_DATA(this.db,null,dao.owner,dao.privacy,dao.title);
    dao_tmp.creation_date = dao.creation_date;
    dao_tmp.id = dao.id;

    return dao_tmp;
}

DAO_LOG.prototype.title_avaible = function(owner,title,callback){

    this.get_all_user(owner,function(err,args){
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

DAO_LOG.prototype.create = function(privacy,owner,title,callback,stmt){
    shasum = require('shasum');
    dao = new DAO_DATA(this.db,null,dao.owner,dao.privacy,dao.title);
    dao.creation_date = Date.now();
    dao.id = shasum(dao.owner,dao.title,dao.creation_date);
    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
    dao.title_avaible(dao.owner,dao.title,function(err,args){
        if (!err) {
            stmt.insert({
                table:'Users',
                keys:null,
                values:{
                    creation_date:dao.creation_date,
                    privacy:dao.privacy,
                    title:dao.title,
                    owner:dao.owner
                }
            });
            if (finalize) {
                stmt.exec(callback);
            }
        } else {
            callback(err,args)
        }
    })



}

DAO_LOG.prototype.update = function(callback,stmt,finalize){

    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
    if (!this.id) {
        this.create(this,callback,stmt);
    } else {
        self = this;
        self.title_avaible(self.owner,self.title,function(err,args){
            if (!err) {
                stmt.update({
                    table:'Users',
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
                }
            } else {
                callback(err,args)
            }
        })
    }
    if (finalize) {
        stmt.exec(callback);
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

    var dao_topic = new DAO_TOPIC();
    var dao_log_user = new DAO_LOG_USER();

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
            if (m == dao_topics.length) {
                dao_log_user.get_all_user(self.id,function(err,args){
                    if (!err) {
                        dao_logs_users = args
                        dao_logs_users[n].delete(recursive_callback_delete_log_relations,stmt,false);
                    } else {
                        callback(err,args);
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
            if (n == dao_logs_users.length) {
                stmt.delete({
                    table:'Logs',
                    keys:{
                        id:this.id
                    },
                    values:null
                });
                if (finalize) {
                    stmt.exec(callback);
                }
            } else {
                dao_logs_users[n].delete(recursive_callback_delete_log_relations,stmt,false);
            }
        } else {
            callback(err,args);
        }
    }

    dao_topic.get_all_log(self.id,function(err,args){
        if (!err) {
            dao_topics = args
            dao_topics[m].delete(recursive_callback_delete_topics,stmt,false);
        } else {
            callback(err,args);
        }
    });

}



DAO_LOG.prototype.get = function(id,callback){

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
            dao = new DAO_LOG(db,null,args[0].owner,args[0].privacy,args[0].title);
            dao.id = args[0].id;
            callback(err,dao);
        }else{
            callback(err,args)
        }
    });

}

DAO_LOG.prototype.get_all_user = function(id,callback){

    this.db.select({
        table:'Logs',
        keys:{
            owner:id
        },
        values:null
    },callback);

}

module.exports = DAO_LOG;
