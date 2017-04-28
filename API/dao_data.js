function DAO_Data(db,id){

    this.db = db;
    if (id) {
        this.get(id,this.erase);
    }

    this.regen = function (err,dao) {

        var dao_tmp = new DAO_Data(this.db);

        if (!err) {
            dao_tmp.log_datetime = dao.log_datetime;
            dao_tmp.id = dao.id;
            dao_tmp.topic = dao.topic;
            dao_tmp.user = dao.user;
            dao_tmp.type = dao.type;
            dao_tmp.value = dao.value;
            if (dao_tmp.type == 'complexe') {
                for (label in dao_tmp.value) {
                    dao_tmp.value[label]=this.regen(null,dao_tmp.value[label]);
                }
            }
            if (dao_tmp.type == 'model') {
                for (label in dao_tmp.value) {
                    for (i in dao_tmp.value[label]) {
                        dao_tmp.value[label][i]=this.regen(null,dao_tmp.value[label][i]);
                    }
                    dao_tmp.value[label]=this.regen(null,dao_tmp.value[label]);
                }
            }
        }

        return dao_tmp;
    }

    this.create = function (topic,user,type,value,callback) {
        shasum = require('shasum');
        dao = new DAO_Data(this.db);
        dao.callback = callback
        dao.log_datetime = Date.now();
        dao.id = shasum(topic+user+dao.log_datetime)
        dao.topic = topic;
        dao.user = user;
        dao.type = type;
        dao.value = value;
        var stmt = this.db.stmt(true);
        stmt.insert({
            table:'Data',
            keys:null,
            values:{
                log_datetime:dao.log_datetime,
                id:dao.id,
                topic:dao.topic,
                user:dao.user,
                type:dao.type
            }
        });
        if (dao.type=='Complexe' || dao.type=='Model') {
            stmt.insert({
                table:'Data'+dao.type+'s',
                keys:null,
                values:{
                    id:dao.id,
                }
            });
        } else {
            stmt.insert({
                table:'Data'+dao.type+'s',
                keys:null,
                values:{
                    id:dao.id,
                    value:dao.value
                }
            });
        }
        stmt.exec(callback);

    }

    this.create_callback = function (err,args) {

        if (!err) {
            this.callback(err,this);
        }
    }

    this.update = function (callback,stmt,finalize) {
        if (!stmt) {
            stmt = this.db.stmt(true);
        }

        if (this.type == 'Complexe' || this.type == 'Model') {
            var labels = Object.keys(this.value);
            if (this.type == 'Complexe') {
                for (label in this.value) {
                    stmt.update({
                        table:'Complexes_Data',
                        keys:{
                            parent:this.id,
                            label:label
                        },
                        values:{
                            data:this.value[label].id
                        }
                    });
                    this.value[label].update(null,stmt,false);
                }
            } else { // Model
                var Sync = require('sync');
                var dao = this;
                this.db.select.sync({
                    table:'Models_Data',
                    keys:{
                        parent:this.id
                    },
                    values:null
                },function(){
                    for (label in dao.value) {
                        var ids = new Array()
                        for (var i = 0; i < results.length; i++) {
                            if (results[i].label == label) {
                                ids.push(results[i].id);
                            }
                        }
                        for (var i = 0; i < dao.value[label].length; i++) {

                            var is_in = false;
                            for (var k = 0; (k < ids.length && !is_in); k++) {
                                if(ids[k] == dao.value[label][i].id){
                                    is_in = true;
                                    ids[k] == null;
                                }
                            }
                            if (!is_in) {
                                stmt.insert({
                                    table:'Complexes_Data',
                                    keys:null,
                                    values:{
                                        parent:dao.id,
                                        label:label,
                                        data:dao.value[label][i].id
                                    }
                                });
                            }
                            dao.value[label][i].update(null,stmt,false);
                        }
                        for (var i = 0; i < ids.length; i++) {
                            if (ids[i]) {
                                stmt.delete({
                                    table:'Complexes_Data',
                                    keys:{
                                        parent:dao.id,
                                        label:label,
                                        data:ids[i]
                                    },
                                    values:null
                                });
                            }
                        }
                    }
                });
            }
        } else {
            console.log(this);
            stmt.update({
                table:'Data'+this.type+'s',
                keys:{
                    id:this.id
                },
                values:{
                    value:this.value
                }
            });

        }
        if (!finalize) {
            stmt.exec(callback);

        }
    }

    this.delete = function (callback,stmt,finalize) {
        if (!stmt) {
            stmt = this.db.stmt(true);
        }

        if (this.type == 'Complexe' || this.type == 'Model') {
            var labels = Object.keys(this.value);
            if (this.type == 'Complexe') {
                for (label in this.value) {
                    stmt.delete({
                        table:'Complexes_Data',
                        keys:{
                            parent:this.id,
                            data:this.value[label].id
                        },
                        values:null
                    });
                    this.value[label].delete(null,stmt,false);
                }
            } else { // Model
                for (label in this.value) {
                    for (var i = 0; i < this.value[label].length; i++) {
                        stmt.delete({
                            table:'Models_Data',
                            keys:{
                                parent:this.id,
                                data:this.value[label].id
                            },
                            values:null
                        });
                        this.value[label][i].delete(null,stmt,false);
                    }
                }
            }
        }
        stmt.delete({
            table:'Data'+this.type+'s',
            keys:{
                id:this.id
            },
            values:null
        });
        stmt.delete({
            table:'Data',
            keys:{
                id:this.id
            },
            values:null
        });
        if (!finalize) {
            console.log(stmt.sql);
            stmt.exec(callback);

        }
    }

    this.get = function (id,callback) {

        var dao = new DAO_Data(this.db);
        dao.lock = true;

        this.db.select({
            table:'Data',
            keys:{
                id:id
            },
            values:null
        },function(err,args){
            if (args) {
                dao.id = args[0].id
                dao.log_datetime = args[0].log_datetime
                dao.topic = args[0].topic
                dao.user = args[0].user
                dao.type = args[0].type
                if (dao.type == 'Complexe') {
                    dao.db.select({
                        table:'Complexes_Data',
                        keys:{
                            parent:dao.id
                        },
                        values:null
                    },function(err,args){
                        if (args) {
                            dao.value = new Object();
                            for (row in args){
                                dao.values[args[row].label] = new DAO_Data(dao.db,row.data);

                            }
                            dao.lock = false;
                            callback(null,dao);
                        } else {
                            dao.lock = false;
                            callback("this data does'nt exist in ComplexesData",null)
                        }
                    });

                } else if (dao.type == 'Model'){
                    dao.db.select({
                        table:'Models_Data',
                        keys:{
                            parent:dao.id
                        },
                        values:null
                    },function(err,args){
                        if (args) {
                            dao.value = new Object();
                            for (row in args){
                                if (!dao.values[args[row].label]) {
                                    dao.values[args[row].label] = new Array();
                                }
                                dao.values[args[row].label].push(new DAO_Data(dao.db,row.data));
                            }
                            dao.lock = false;
                            callback(null,dao);

                        } else {
                            dao.lock = false;
                            callback("this data does'nt exist in ModelsData",null)
                        }
                    });

                } else {
                    dao.db.select({
                        table:'Data'+dao.type+'s',
                        keys:{
                            id:dao.id
                        },
                        values:null
                    },function(err,args){
                        if (args) {
                            dao.value = args[0].value
                            dao.lock = false;
                            console.log(dao);
                            callback(null,dao);
                        } else {
                            dao.lock = false;
                            callback("this data does'nt exist in Specific TypeData (Text,Boolean,Number,Date)",null)
                        }
                    });
                }


            } else {
                dao.lock = false;
                callback(err,null)
            }
        });
    }

    this.get_all = function (type,callback) {
        if (type) {
            this.db.select_all({
                table:'Data',
                keys:null,
                values:null
            },callback);
        } else {
            this.db.select_all({
                table:'Data'+type+'s',
                keys:null,
                values:null
            },callback);
        }
    }

}

module.exports = DAO_Data;
