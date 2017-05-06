function DAO_DATA(db,id,topic,user,type,value){

    this.db = db;
    if (id) {
        var self = this;
        this.get(id,function(err,args){
            if (!err) {
                self.id = args.id;
                self.topic = args.topic;
                self.user = args.user;
                self.type = args.type;
                self.value = args.value;
                self.log_datetime = args.log_datetime;
            }
        });
    } else {
        this.id = null;
        this.topic = topic;
        this.user = user;
        this.type = type;
        this.value = value;
    }

}

DAO_DATA.prototype.equal = function (dao) {
    var ret = true;
    if(this.id != dao.id || this.topic != dao.topic || this.user != dao.user || this.type != dao.type || this.log_datetime != dao.log_datetime){
        ret = false;
    } else {
        if (this.type == 'complexe' || this.type == 'model') {
            var array = Object.keys(this.value);
            var array2 = Object.keys(dao.value);
            if (array.length != array2.length) {
                if (this.type == 'complexe') {
                    for (var i = 0; (i < array.length && ret); i++) {
                        ret = this.value[array[i]].equal(dao.value[array[i]]);
                    }

                } else if (this.type == 'model'){
                    for (var i = 0; (i < array.length && ret); i++) {
                        if (this.value[array[i]] instanceof Array) {
                            if (dao.value[array[i]] instanceof Array) {
                                ret = (this.value[array[i]].length == dao.value[array[i]].length);
                                for (var j = 0; j < (this.value[array[i]].length && ret ); j++) {
                                    ret = this.value[array[i]][j].equal(       dao.value[array[i]][j]);
                                }

                            } else {
                                ret = false;
                            }
                        } else {
                            ret = (this.value[array[i]] == dao.value[array[i]]);
                        }
                    }
                }
            }
        } else {
            if (this.value != dao.value) {
                ret = false;
            }
        }
    }


    return ret;
}

DAO_DATA.prototype.clone = function (dao) {

    if (!dao) {
        dao = this;
    }

    var new_dao = new DAO_DATA(this.db,null,dao.topic,dao.user,dao.type,dao.value);

    if (dao.type=='Complexe' || dao.type=='Model') {
        new_dao.value = new Object;
        for (label in dao.value) {
            if (dao.type=='Model') {
                if (dao.value[label] instanceof Array) {
                    new_dao.value[label] = new Array();
                    for (var i = 0; i < dao.value[label].length; i++) {
                        new_dao.value[label][i] = dao.value[label][i].clone();
                    }
                } else {
                    new_dao.value[label] = dao.value[label];
                }

            } else {
                new_dao.value[label] = dao.value[label].clone();
            }
        }
    }
    return new_dao

}

DAO_DATA.prototype.regen = function (dao) {

    var dao_tmp = new DAO_DATA(this.db,null,dao.topic,dao.user,dao.type,dao.value);
    dao_tmp.log_datetime = dao.log_datetime;
    dao_tmp.id = dao.id;
    if (dao_tmp.type == 'complexe') {
        for (label in dao_tmp.value) {
            dao_tmp.value[label]=this.regen(null,dao_tmp.value[label]);
        }
    }
    if (dao_tmp.type == 'model') {
        for (label in dao_tmp.value) {
            if (dao.value[label] instanceof Array) {
                for (i in dao_tmp.value[label]) {
                    dao_tmp.value[label][i]=this.regen(null,dao_tmp.value[label][i]);
                }
            }
        }
    }


    return dao_tmp;
}

DAO_DATA.prototype.create_dao = function(dao,callback,stmt){

    this.create(dao.topic,dao.user,dao.type,dao.value,callback,stmt);

}

DAO_DATA.prototype.create = function (topic,user,type,value,callback,stmt) {
    var finalize = false;
    shasum = require('shasum');
    dao = new DAO_DATA(this.db,null,topic,user,type,value);
    dao.log_datetime = Date.now();
    dao.id = shasum(topic+user+dao.log_datetime)
    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
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
    if (finalize) {
        stmt.exec(callback);
    }


}

DAO_DATA.prototype.update = function (callback,stmt,finalize) {
    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }

    var self = this;

    if (!this.id) { // If id is null, create the data
        this.create(self,function(err,args){
            if (!err) {
                self._update(callback,stmt,finalize,false);
            }
        },stmt);
    } else {
        self._update(callback,stmt,finalize,true);
    }


}


// Should not be called by externs
DAO_DATA.prototype._update = function (callback,stmt,finalize,update){
    // 1 - If the object is already in database :
    //  update user in Data (with id of object as key),
    if (update) {
        stmt.update({
            table:'Data',
            keys:{
                id:this.id
            },
            values:{
                user:this.user
            }
        });
    }
    if (this.type == 'Complexe') {


        // 2 - Else : create the object in databse (see update()) and (here) insert it in Complexes_Data as new connection
        // 3 - Finish by calling sub-object update()
        // At the end, finalize statement if finalize param is true


        for (label in this.value) {
            if (dao.value[label].id == this.id) {
                callback('Cycle detected at label '+label,null);
                return;
            }
            // 2 - For all sub-object, call update
            this.value[label].update(null,stmt,false);
            // 3 - If object already in database, update relations in Complexes_Data (update the id of sub-object (know as 'data'))
            if (update) {
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
            } else {
                // 3 bis - If object were not present in database, all relation in Complexes_Data don't exist yet, so we add them
                stmt.insert({
                    table:'Complexes_Data',
                    keys:null,
                    values:{
                        parent:this.id,
                        label:label,
                        data:this.value[label].id
                    }
                });
            }
        }
        // 4 - if finalize, execute the treatement
        if (finalize) {
            stmt.exec(callback);

        }
    } else if(this.type == 'Model') { // Model

        var dao = this;

        // 2 - we ask for all knowed relation with the object in Models_Data

        this.db.select({
            table:'Models_Data',
            keys:{
                parent:this.id
            },
            values:null
        },function(err,args){
            if (!err) {
                // Because we (may) have async call (in sub object calling) but need to do all things as sync traitement, we will use a recursive function to treate all avaibles values of all labels of the object

                var labels = new Array();
                var m = 0 // label
                var n = 0 // avaible value for a label m
                var label = labels[m];
                var ids = new Array();

                for lab in dao.value {
                    if (dao.value[lab] instanceof Array()) {
                        labels.push(lab);
                        for (var i = 0; i < dao.value[lab].length; i++) {
                            // DETECTION OF CYCLE WITH DAO ID
                            if (dao.value[lab][i].id == dao.id) {
                                callback('Cycle detected at label '+lab,null);
                                return;
                            }
                        }
                    } else {
                        // DETECTION OF CYCLE WITH DAO ID
                        if (dao.value[lab] == dao.id) {
                            callback('Cycle detected at label '+lab,null);
                            return;
                        }
                        stmt.update({
                            table:'Models_Data',
                            keys:{
                                parent:dao.id,
                                label:lab
                            },
                            values:{
                                data:dao.value[lab]
                            }
                        });
                    }
                }


                for (var i = 0; i < results.length; i++) {
                    if (args[i].label == label) {
                        ids.push(args[i].id);
                    }
                }

                var recursif_callback_update(err,args){
                    if (!err) {
                        label = labels[m];

                        // 3 - for the label m

                        if (n = labels[m].length) {
                            // At the end of update of all values for a label, look for relation (in database) to remove (cause don't still exist in new version of the model)

                            for (var i = 0; i < ids.length; i++) {
                                if (ids[i]) {
                                    stmt.delete({
                                        table:'Models_Data',
                                        keys:{
                                            parent:dao.id,
                                            label:label,
                                            data:ids[i]
                                        },
                                        values:null
                                    });
                                }
                            }


                            // Go to the next label
                            m++;
                            label = labels[m];
                            // If all label are updated, end the function
                            if (m == labels.length) {
                                if (finalize) {
                                    stmt.exec(callback);
                                }
                                return;
                            }
                            // Else continue on the next label, reset value no at 0 and get all relation id (data) link to this label
                            n = 0;

                            ids = new Array();
                            for (var i = 0; i < results.length; i++) {
                                if (args[i].label == label) {
                                    ids.push(args[i].id);
                                }
                            }

                        }

                        // 4 - for value (sub-object) n in label m, look if his id exist in relation were parent if object and label is the current label m

                        var is_in = false;
                        for (var k = 0; (k < ids.length && !is_in); k++) {
                            if(ids[k] == dao.value[label][n].id){
                                is_in = true;
                                ids[k] == null;
                            }
                        }

                        // 4 bis - if does't exist, add a relation

                        if (!is_in) {
                            stmt.insert({
                                table:'Models_Data',
                                keys:null,
                                values:{
                                    parent:dao.id,
                                    label:label,
                                    data:dao.value[label][n].id
                                }
                            });
                        }

                        n++;

                        // 5 - go the next value in label m

                        dao.value[label][n].update(recursif_callback_update,stmt,false);

                    } else {
                        callback(err,args);
                    }
                }
                // Do the first call to recursive function

                dao.value[label][n].update(recursif_callback_update,stmt,false);
            } else {
                callback(err,args);
            }
        });
    } else if (update){
        stmt.update({
            table:'Data'+this.type+'s',
            keys:{
                id:this.id
            },
            values:{
                value:this.value
            }
        });
        if (finalize) {
            stmt.exec(callback);

        }

    }

}

DAO_DATA.prototype.delete = function (callback,stmt,finalize) {
    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
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
    } else if (this.type == 'Model') { // Model
        for (label in this.value) {
            if (this.value[label] instanceof Array) {
                for (var i = 0; i < this.value[label].length; i++) {
                    stmt.delete({
                        table:'Models_Data',
                        keys:{
                            parent:this.id,
                            label:label,
                            data:this.value[label][i].id
                        },
                        values:null
                    });
                    this.value[label][i].delete(null,stmt,false);
                }
            } else {
                stmt.delete({
                    table:'Models_Data',
                    keys:{
                        parent:this.id,
                        label:label,
                        data:this.value[label]
                    },
                    values:null
                });
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
    if (finalize) {
        stmt.exec(callback);

    }
}

DAO_DATA.prototype.get = function (id,callback) {

    var dao;
    var db = this.db;
    this.db.select({
        table:'Data',
        keys:{
            id:id
        },
        values:null
    },function(err,args){
        if (!err) {
            dao = new DAO_DATA(db,null,args[0].topic,args[0].user,args[0].type,new Object());
            dao.id = args[0].id
            if (dao.type == 'Complexe') {
                var rows;
                var m = 0 // indice in rows (args);
                var recursive_callback = function(err,args){
                    if (!err) {
                        dao.values[rows[m].label] = args;
                        m++
                        if (m = rows.length) {
                            callback(null,dao);
                        }
                        dao.get(rows[m].data,recursive_callback);
                    } else {
                        callback(err,args);
                    }
                }
                dao.db.select({
                    table:'Complexes_Data',
                    keys:{
                        parent:dao.id
                    },
                    values:null
                },function(err,args){
                    if (!err) {
                        rows = args;
                        dao.get(rows[m].data,recursive_callback);
                    } else {
                        callback(err,args)
                    }
                });

            } else if (dao.type == 'Model'){
                var rows;
                var m = 0 // indice in rows (args);
                var recursive_callback = function(err,args){
                    if (!err) {
                        if (!dao.values[rows[m].label]) {
                            dao.values[rows[m].label] = new Array();
                        }
                        dao.values[rows[m].label].push(args);
                        m++;
                        if (m = rows.length) {
                            callback(null,dao);
                        }
                        dao.get(rows[m].data,recursive_callback);
                    } else {
                        callback(err,args);
                    }
                }
                dao.db.select({
                    table:'Models_Data',
                    keys:{
                        parent:dao.id
                    },
                    values:null
                },function(err,args){
                    if (!err) {
                        rows = new Array();
                        for (var i = 0; i < args.length; i++) {

                            if args[i].data ==('Text'  || args[i].data == 'Date'  || args[i].data == 'Boolean'  || args[i].data == 'Number'  || args[i].data == 'Complexe'  || args[i].data == 'Model') {
                                dao.values[args[i].label]=args[i].data
                            } else {
                                rows.push(args[]);
                            }
                        }
                        dao.get(rows[m].data,recursive_callback);
                    } else {
                        callback(err,args)
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
                        callback(err,null)
                    }
                });
            }


        } else {
            callback(err,args)
        }
    });
}

DAO_DATA.prototype.get_all = function (type,callback) {
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

DAO_DATA.prototype.get_all_topic = function (topic,type,callback) {
    if(topic){
        if (type) {
            this.db.select({
                table:'Data'+type+'s',
                keys:{
                    topic:topic
                },
                values:null
            },callback);
        } else {
            this.db.select({
                table:'Data',
                keys:{
                    topic:topic
                },
                values:null
            },callback);
        }
    }
}

module.exports = DAO_DATA;
