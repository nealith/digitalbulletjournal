var DAO_Data = function(db,id){

    this.db = db;
    if (id) {
        this.get(id,this.erase);
    }

}

DAO_Data.prototype.erase = function (err,dao) {
    if (!err) {
        this = dao;
    }
}

DAO_Data.prototype.create = function (topic,user,type,value,callback) {
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
    });
    stmt.insert({
    table:'Data'+dao.type,
    keys:null,
    values:{
        id:dao.id,
        value:value
    });
    stmt.exec();

}

DAO_Data.prototype.create_callback = function (err,args) {

    if (!err) {
        this.callback(err,this);
    }
}

DAO_Data.prototype.update = function (stmt,callback) {
    if (!stmt) {
        stmt = this.db.stmt(true);
    }

    if (this.type == 'Complexe' || this.type == 'Model') {
        var labels = Object.keys(this.value);
        if (this.type == 'Complexe') {
            for (label in labels) {
                stmt.update({
                table:'Complexes_Data',
                keys:{
                    parent:this.id,
                    label:label
                },
                values:{
                    data:this.value[label].id
                });
                this.value[label].update(null,stmt,false);
            }
        } else { // Model
            var Sync = require('sync');
            var results = Sync(function(){this.db.select({
                table:'Models_Data',
                keys:{
                    parent:this.id
                },
                values:null
            });})
            for (label in labels) {
                var ids = new Array()
                for (var i = 0; i < results.length; i++) {
                    if (results[i].label == label) {
                        ids.push(results[i].id);
                    }
                }
                for (var i = 0; i < this.value[label].length; i++) {

                    var is_in = false;
                    for (var k = 0; (k < ids.length && !is_in); k++) {
                        if(ids[k] == this.value[label][i].id){
                            is_in = true;
                            ids[k] == null;
                        }
                    }
                    if (!is_in) {
                        stmt.insert({
                        table:'Complexes_Data',
                        keys:null,
                        values:{
                            parent:this.id,
                            label:label
                            data:this.value[label][i].id
                        });
                    }
                    this.value[label][i].update(null,stmt,false);
                }
                for (var i = 0; i < ids.length; i++) {
                    if (ids[i]) {
                        stmt.delete({
                        table:'Complexes_Data',
                        keys:{
                            parent:this.id,
                            label:label,
                            data:ids[i]
                        },
                        values:null);
                    }
                }
            }
        }
    }
    stmt.delete({
        table:'Data'+this.type,
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
        stmt.exec(callback);

    }
}

DAO_Data.prototype.delete = function (callback,stmt,finalize) {
    if (!stmt) {
        stmt = this.db.stmt(true);
    }

    if (this.type == 'Complexe' || this.type == 'Model') {
        var labels = Object.keys(this.value);
        if (this.type == 'Complexe') {
            for (label in labels) {
                stmt.delete({
                table:'Complexes_Data',
                keys:{
                    parent:this.id,
                    data:this.value[label].id
                },
                values:null);
                this.value[label].delete(null,stmt,false);
            }
        } else { // Model
            for (label in labels) {
                for (var i = 0; i < this.value[label].length; i++) {
                    stmt.delete({
                    table:'Models_Data',
                    keys:{
                        parent:this.id,
                        data:this.value[label].id
                    },
                    values:null);
                    this.value[label][i].delete(null,stmt,false);
                }
            }
        }
    }
    stmt.delete({
        table:'Data'+this.type,
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
        stmt.exec(callback);

    }
}

DAO_Data.prototype.get_Data = function(err,args){
    if (args) {
        this.log_datetime = args.log_datetime
        this.topic = args.topic
        this.user = args.user
        this.type = args.type
        if (this.type == 'Complexe') {
            this.db.select({
                table:'Complexes_Data',
                keys:{
                    parent:this.id
                },
                values:null
            },this.get_Data_Complexe);

        } else if (this.type == 'Model'){
            this.db.select({
                table:'Models_Data',
                keys:{
                    parent:this.id
                },
                values:null
            },this.get_Data_Model);

        } else {
            this.db.select({
                table:'Data'+this.type,
                keys:{
                    id:this.id
                },
                values:null
            },this.get_Data_Value);
        }


    } else {
        this.callback("this data does'nt exist",null)
    }


}

// Text,Date,Boolean,Number
DAO_Data.prototype.get_Data_Value = function(err,args){
    if (args) {
        this.value = args[0].value
        this.callback(null,this);
        this.callback = null;
    } else {
        this.callback("this data does'nt exist",null)
    }


}

DAO_Data.prototype.get_Data_Complexe = function(err,args){
    if (args) {
        this.value = new Object();
        for (row in args){
            this.values.[row.label] = new DAO_Data(this.db,row.data);

        }
        this.callback(null,this);
        this.callback = null;
    } else {
        this.callback("this data does'nt exist",null)
    }


}

DAO_Data.prototype.get_Data_Model = function(err,args){
    if (args) {
        this.value = new Object();
        for (row in args){
            if (!this.values.[row.label]) {
                this.values.[row.label] = new Array();
            }
            this.values.[row.label].push(new DAO_Data(this.db,row.data));
        }
        this.callback(null,this);
        this.callback = null;
        this.lock = false;
    } else {
        this.callback("this data does'nt exist",null)
    }


}

DAO_Data.prototype.get = function (id,callback) {

    dao = new DAO_Data(this.db);
    dao.callback = callback
    dao.lock = true;

    this.db.select({
        table:'Data',
        keys:{
            id:this.id
        },
        values:null
    },dao.get_Data);
}

DAO_Data.prototype.get_all_type = function () {

}

DAO_Data.prototype.get_all_data = function () {

}

module.exports = DAO_Data;
