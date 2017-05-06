var DAO_TOPIC = function(db,id,log,title){


    this.db = db;
    if(id){
        var self = this;
        this.get(id,function(err,args){
            if (!err) {
                self.id = args.id;
                self.log = args.log;
                self.title = args.title;
                self.creation_date = args.creation_date;
            }
        });
    } else {
        this.id = null;
        this.log = log;
        this.title = title;
    }

}

DAO_TOPIC.prototype.equal = function(dao) {
    return (this.id == dao.id &&  this.log == dao.log &&  this.title == dao.title &&  this.creation_date == dao.creation_date);
};

DAO_TOPIC.prototype.regen = function (dao) {

    var dao_tmp = new DAO_DATA(this.db,null,dao.log,dao.title);
    dao_tmp.creation_date = dao.creation_date;
    dao_tmp.id = dao.id;

    return dao_tmp;
}

DAO_TOPIC.prototype.title_avaible = function(log,title,callback){

    this.get_all_log(log,function(err,args){
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



DAO_TOPIC.prototype.create_dao = function(dao,callback,stmt){
    this.create(dao.log, dao.title, callback, stmt);
}

DAO_TOPIC.prototype.create = function(log,title,callback,stmt){
    shasum = require('shasum');
    dao = new DAO_DATA(this.db,null,dao.log,dao.title);
    dao.creation_date = Date.now();
    dao.id = shasum(dao.log,dao.title,dao.creation_date);
    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
    dao.title_avaible(dao.log,dao.title,function(err,args){
        if (!err) {
            stmt.insert({
                table:'Topics',
                keys:null,
                values:{
                    creation_date:dao.creation_date,
                    title:dao.title,
                    log:dao.log
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

DAO_TOPIC.prototype.update = function(callback,stmt,finalize){

    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
    if (!this.id) {
        this.create(this,callback,stmt);
        if (finalize) {
            stmt.exec(callback);
        }
    } else {
        self = this;
        self.title_avaible(self.log,self.title,function(err,args){
            if (!err) {
                stmt.update({
                    table:'Topics',
                    keys:{
                        id:self.id
                    },
                    values:{
                        title: self.title,
                        log: self.log
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


}

DAO_TOPIC.prototype.delete = function(callback,stmt,finalize){

    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }

    var self = this;

    var DAO_DATA = require('./dao_data.js');

    var dao_data = new DAO_DATA(self.db);

    var all_data;

    // 1 - list all data linked to the topic
    // 2 - for all data, create the dao, call delete

    var m = 0 // data m

    var recursive_callback_delete_data = function(err,args){
        if (!err) {
            m++;
            if (m == all_data.length) {
                if (finalize) {
                    stmt.exec(callback);
                }
            } else {
                dao_data.get(all_data[m],function(err,args){
                    if (!err) {
                        args.delete(recursive_callback_delete_data,stmt,false);
                    } else {
                        callback(err,args);
                    }
                });
            }
        } else {
            callback(err,args);
        }
    }

    dao_data.get_all_topic(self.id,null,function(err,args){
        if (!err) {
            all_data = args;
            // Launch call on recursive_callback_delete_data
            dao_data.get(all_data[m],function(err,args){
                if (!err) {
                    args.delete(recursive_callback_delete_data,stmt,false);
                } else {
                    callback(err,args);
                }
            });
        } else {
            callback(err,args);
        }
    });

}



DAO_TOPIC.prototype.get = function(id,callback){

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
            dao = new DAO_TOPIC(db,null,args[0].log,args[0].title);
            dao.id = args[0].id;
            callback(err,dao);
        }else{
            callback(err,args)
        }
    });

}

DAO_TOPIC.prototype.get_all_log = function(id,callback){

    this.db.select({
        table:'Topics',
        keys:{
            log:id
        },
        values:null
    },callback);

}

module.exports = DAO_TOPIC;
