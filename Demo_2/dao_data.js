function DAO_DATA(db,id,callback,topic,user,type,value,model){

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
                if (self.type == 'Boolean') {
                    if (self.value == 0) {
                        self.value = true;
                    } else {
                        self.value = false;
                    }
                }
                self.log_datetime = args.log_datetime;
                if (self.type == 'Compound') {
                    self.model = args.model;
                }
                callback(err,self);
            } else {
                callback(err,null);
            }
        });
    } else {
        this.id = null;
        this.topic = topic;
        this.user = user;
        this.type = type;
        this.value = value;
        if (this.type == 'Compound') {
            this.model = model;
        }
    }

}

DAO_DATA.prototype.equal = function (dao) {
    var ret = true;
    if(this.id != dao.id || this.topic != dao.topic || this.user != dao.user || this.type != dao.type || this.log_datetime != dao.log_datetime){
        ret = false;
    } else {
        if (this.type == 'Compound' || this.type == 'Model') {
            if (this.type == 'Compound') {
                ret = this.model == dao.model;
            }
            var array = Object.keys(this.value);
            var array2 = Object.keys(dao.value);
            if (array.length != array2.length && ret) {
                if (this.type == 'Compound') {
                    for (var i = 0; (i < array.length && ret); i++) {
                        ret = this.value[array[i]].equal(dao.value[array[i]]);
                    }

                } else if (this.type == 'Model'){
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

    var new_dao = new DAO_DATA(this.db,null,dao.topic,dao.user,dao.type,dao.value,dao.model);

    if (dao.type=='Compound' || dao.type=='Model') {
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

    var dao_tmp = new DAO_DATA(this.db,null,null,dao.topic,dao.user,dao.type,dao.value,dao.model);
    dao_tmp.log_datetime = dao.log_datetime;
    dao_tmp.id = dao.id;
    if (dao_tmp.type == 'Compound') {
        for (label in dao_tmp.value) {
            dao_tmp.value[label]=this.regen(dao_tmp.value[label]);
        }
    }
    if (dao_tmp.type == 'model') {
        for (label in dao_tmp.value) {
            if (dao.value[label] instanceof Array) {
                for (i in dao_tmp.value[label]) {
                    dao_tmp.value[label][i]=this.regen(dao_tmp.value[label][i]);
                }
            }
        }
    }


    return dao_tmp;
}

DAO_DATA.prototype.create_dao = function(dao,callback,stmt,finalize){
    var finalize = false;
    shasum = require('shasum');
    dao.log_datetime = Date.now();
    var tmp_d = new Date();
    dao.id = shasum(dao.topic+dao.user+dao.log_datetime+dao.type+tmp_d.getMilliseconds()+Math.random()+Math.random());
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
    if (dao.type=='Compound') {
        stmt.insert({
            table:'Data'+dao.type+'s',
            keys:null,
            values:{
                id:dao.id,
                model:dao.model
            }
        });
    } else if (dao.type=='Model') {
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
        stmt.exec(callback,dao);
    } else {
        callback(null,dao);
    }


}

DAO_DATA.prototype.create = function (topic,user,type,value,callback,stmt,finalize) {

    var dao = new DAO_DATA(this.db,null,null,topic,user,type,value);
    if (dao.type == 'Compound') {
        dao.model = value;
    }
    this.create_dao(dao,callback,stmt,finalize);


}

DAO_DATA.prototype.update = function (callback,stmt,finalize) {
    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
    var self = this;

    if (!this.id) { // If id is null, create the data
        this.create_dao(self,function(err,args){
            if (!err) {
                self._update(callback,stmt,finalize,false);
            } else {
                callback(err,args);
            }
        },stmt);
    } else {
        var dao;
        this.get(self.id,function(err,args){

            if (!err) {
                dao = args;
                if (dao.type != self.type) {
                    stmt.delete({
                        table:'Data'+dao.type+'s',
                        keys:{
                            id:dao.id
                        },
                        values:null
                    });
                    stmt.update({
                        table:'Data',
                        keys:{
                            id:self.id
                        },
                        values:{
                            user:self.user,
                            type:self.type
                        }
                    });
                    if (self.type=='Compound') {
                        stmt.insert({
                            table:'Data'+self.type+'s',
                            keys:null,
                            values:{
                                id:self.id,
                                model:self.model
                            }
                        });
                        self._update(callback,stmt,finalize,false);
                    } else if (self.type=='Model') {
                        stmt.insert({
                            table:'Data'+self.type+'s',
                            keys:null,
                            values:{
                                id:self.id,
                            }
                        });
                        self._update(callback,stmt,finalize,false);
                    } else {
                        stmt.insert({
                            table:'Data'+self.type+'s',
                            keys:null,
                            values:{
                                id:self.id,
                                value:self.value
                            }
                        });
                        if (finalize) {
                            stmt.exec(callback,self);
                        } else {
                            callback(null,self);
                        }
                    }

                }
            } else {
                callback(err,args);
            }
        })

    }


}


// Should not be called by externs
DAO_DATA.prototype._update = function (callback,stmt,finalize,update){
    // 1 - If the object is already in database :
    //  update user in Data (with id of object as key),
    var dao = this;

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
    if (this.type == 'Compound') {
        if (update) {
            stmt.update({
                table:'DataCompounds',
                keys:{
                    id:this.id
                },
                values:{
                    model:this.model
                }
            });
        }

        // 2 - Else : create the object in databse (see update()) and (here) insert it in Compounds_Data as new connection
        // 3 - Finish by calling sub-object update()
        // At the end, finalize statement if finalize param is true


        for (label in this.value) {
            if (dao.value[label].id == this.id) {
                callback('Cycle detected at label '+label,null);
                return;
            }
            // 2 - For all sub-object, call update
            this.value[label].update(function(){},stmt,false);
            // 3 - If object already in database, update relations in Compounds_Data (update the id of sub-object (know as 'data'))
            if (update) {
                stmt.update({
                    table:'Compounds_Data',
                    keys:{
                        parent:this.id,
                        label:label
                    },
                    values:{
                        data:this.value[label].id
                    }
                });
            } else {
                // 3 bis - If object were not present in database, all relation in Compounds_Data don't exist yet, so we add them
                stmt.insert({
                    table:'Compounds_Data',
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

        } else {
            callback(null,dao);
        }
    } else if(this.type == 'Model') { // Model

        var dao = this;

        // 2 - we ask for all knowed relation with the object in Models_Data

        this.db.select({
            table:'Models_Data',
            keys:{
                parent:dao.id
            },
            values:null
        },function(err,args){
            if (!err) {
                // Because we (may) have async call (in sub object calling) but need to do all things as sync traitement, we will use a recursive function to treate all avaibles values of all labels of the object

                var labels = new Array();
                var m = 0 // label
                var n = 0 // avaible value for a label m
                var label;
                var ids = new Array();

                for (lab in dao.value) {
                    if (dao.value[lab] instanceof Array) {
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
                        var find = false;
                        for (var i = 0; (i < ids.length && !find); i++) {

                            find = (ids[i] == dao.value[lab]);
                        }
                        if (find) {
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
                        } else {
                            stmt.insert({
                                table:'Models_Data',
                                keys:null,
                                values:{
                                    parent:dao.id,
                                    label:lab,
                                    data:dao.value[lab]
                                }
                            });
                        }

                    }
                }


                for (var i = 0; i < args.length; i++) {
                    if (args[i].label == label) {
                        ids.push(args[i].id);
                    }
                }

                var recursif_callback_update = function(err,args){
                    if (!err) {






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

                        // 3 - for the label m

                        if (n == dao.value[label].length) {
                            console.log('finish label');
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
                                } else {
                                    callback(null,dao);
                                }
                                return;
                            }
                            // Else continue on the next label, reset value no at 0 and get all relation id (data) link to this label
                            n = 0;

                            ids = new Array();
                            for (var i = 0; i < args.length; i++) {
                                if (args[i].label == label) {
                                    ids.push(args[i].id);
                                }
                            }

                        }

                        // 5 - go the next value in label m
                        dao.value[label][n].update(recursif_callback_update,stmt,false);

                    } else {
                        callback(err,args);
                    }
                }
                // Do the first call to recursive function

                if (labels.length > 0) {
                    label = labels[m];
                    dao.value[label][n].update(recursif_callback_update,stmt,false);
                } else {
                    if (finalize) {
                        stmt.exec(callback);
                    } else {
                        callback(null,dao);
                    }
                    return;
                }

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
        } else {
            callback(null,dao);
        }

    } else {
        if (finalize) {
            stmt.exec(callback);
        } else {
            callback(null,dao);
        }
    }

}

DAO_DATA.prototype.delete = function (callback,stmt,finalize) {
    if (!stmt) {
        stmt = this.db.stmt(true);
        finalize = true;
    }
    if (this.type == 'Compound') {
        for (label in this.value) {
            stmt.delete({
                table:'Compounds_Data',
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

            if (args.length > 0) {
                dao = new DAO_DATA(db,null,null,args[0].topic,args[0].user,args[0].type,new Object());
                dao.id = args[0].id
                dao.log_datetime = args[0].log_datetime;

                if (dao.type == 'Compound') {
                    dao.db.select({
                        table:'Data'+dao.type+'s',
                        keys:{
                            id:dao.id
                        },
                        values:null
                    },function(err,args){
                        if (args) {
                            dao.model = args[0].model
                            var rows;
                            var m = 0 // indice in rows (args);
                            var recursive_callback = function(err,args){
                                if (!err) {
                                    dao.value[rows[m].label] = args;
                                    m++
                                    if (m == rows.length) {
                                        callback(null,dao);
                                    }
                                    dao.get(rows[m].data,recursive_callback);
                                } else {
                                    callback(err,args);
                                }
                            }
                            dao.db.select({
                                table:'Compounds_Data',
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

                        } else {
                            callback(err,null)
                        }
                    });


                } else if (dao.type == 'Model'){
                    var rows = new Array();
                    var m = 0 // indice in rows (args);
                    var recursive_callback = function(err,args){
                        if (!err) {
                            if (!dao.value[rows[m].label]) {
                                dao.value[rows[m].label] = new Array();
                            }
                            dao.value[rows[m].label].push(args);
                            m++;
                            if (m == rows.length) {
                                callback(null,dao);
                            } else {
                                dao.get(rows[m].data,recursive_callback);
                            }

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
                            for (var i = 0; i < args.length; i++) {
                                if (args[i].data =='Text'  || args[i].data == 'Date'  || args[i].data == 'Boolean'  || args[i].data == 'Number'  || args[i].data == 'Compound'  || args[i].data == 'Model') {
                                    dao.value[args[i].label]=args[i].data
                                } else {
                                    rows.push(args[i]);
                                }
                            }
                            if (rows.length > 0) {
                                dao.get(rows[m].data,recursive_callback);
                            } else {
                                callback(null,dao);
                            }

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
                            dao.value = args[0].value;
                            callback(null,dao);
                        } else {
                            callback(err,null)
                        }
                    });
                }
            } else {
                callback('No data with this id',null);
            }




        } else {
            callback(err,args)
        }
    });
}

DAO_DATA.prototype.get_all = function (topic,type,callback) {
    if(topic){
        if (type) {
            this.db.select({
                table:'Data'+type+'s',
                keys:{
                    topic:topic,
                    type:type
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
    } else {
        if (type) {
            this.db.select({
                table:'Data'+type+'s',
                keys:{
                    type:type
                },
                values:null
            },callback);
        } else {
            this.db.select_all({
                table:'Data',
                keys:null,
                values:null
            },callback);
        }
    }
}

DAO_DATA.prototype.get_all_first_level = function (topic,type,callback) {
    var self = this;
    this.get_all(topic,type,function(err,args){
        if (!err) {
            var data = args;
            self.db.select_all({
                table:'Compounds_Data',
                keys:null,
                values:null
            },function(err,args){
                if (!err) {
                    var compounds_data = args
                    self.db.select_all({
                        table:'Models_Data',
                        keys:null,
                        values:null
                    },function(err,args){
                        if (!err) {
                            var models_data = args
                            var data_data = new Array();
                            data_data = data_data.concat(compounds_data);
                            data_data = data_data.concat(models_data)
                            var ret = new Array();
                            for (var i = 0; i < data.length; i++) {
                                var is_sub_data = false;
                                for (var k = 0; (k < data_data.length && !is_sub_data); k++) {
                                    var is_in = false;
                                    for (var j = 0; (j < data.length && !is_in); j++) {
                                        is_in = (data[j].id == data_data[k].parent)
                                    }
                                    if (is_in) {
                                        is_sub_data = (data_data[k].data == data[i].id);
                                    }
                                }
                                if (!is_sub_data) {
                                    ret.push(data[i]);
                                }

                            }

                            callback(null,ret);

                        } else {
                            callback(err,args);
                        }
                    });
                } else {
                    callback(err,args);
                }
            });
        } else {
            callback(err,args);
        }
    })
}

module.exports = DAO_DATA;
