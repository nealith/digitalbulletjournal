var DAO_Data = function(db,id){

    this.db = db;
    this.async = require("async");
    if (id) {
        var obj = this.get(id);
        this = obj;
    }

}

DAO_Data.prototype.create = function (type,value,stmt) {

}

DAO_Data.prototype.update = function (stmt,callback) {
    if (!this.lock){
        this.callback = callback;
        this.lock = true;
        this.db.begin_transaction();
        if (this.type == 'Complexe') {
            this.update_Data_Complexe();
        } else if (this.type == 'Model'){
            this.update_Data_Model();
        } else {
            this.update_Data_Value();
        }
    }
}

DAO_Data.prototype.update_Data = function (err,args) {
    if (!err) {
        this.db.update({
            table:'Data'+this.type,
            keys:{
                id:this.id
            },
            values:null
        },this.callback);
    }
    this.callback(err,null);
}
DAO_Data.prototype.update_Data_Value = function () {
    this.db.update({
        table:'Data'+this.type,
        keys:{
            id:this.id
        },
        values:{
            value:this.value
        }
    },this.update_Data);
}
DAO_Data.prototype.update_Data_Complexe = function () {
    this.num_sub_elem = Object.keys(this.value).length;
    this.count_sub_elem = 0;
    this.count_err = 0;
    this.errs = '';
    var labels = Object.keys(this.value);
    for (label in labels) {
        this.value[label].update();
    }
}
DAO_Data.prototype.update_Data_Model = function () {
    this.num_sub_elem = 0
    this.count_sub_elem = 0;
    this.count_err = 0;
    this.errs = '';
    var labels = Object.keys(this.value);
    for (label in labels) {
        this.num_sub_elem+=this.value[label].length;
    }
    for (label in labels) {
        for (var i = 0; i < this.value[label].length; i++) {
            this.value[label][i].update();
        }
    }
}
DAO_Data.prototype.update_count = function (err,args){
    this.count_sub_elem++;
    if (err) {this.count_err++;this.errs+=(err+';');}
    if (this.count_sub_elem == this.num_sub_elem) {
        if (this.count_err == 0) {
            this.db.commit_transaction();
        } else {
            this.db.rollback_transaction();
            err="Update::can't update data, id:"+this.id+", because of : {"+this.errs+"}";

        }
        this.lock = false;
        this.callback(err,null);
        this.callback = null;

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
                table:'Complexes_Data',
                keys:{
                    parent:this.id,
                    data:this.value[label].id
                },
                values:null
                this.value[label].delete(null,stmt,false);
            }
        } else { // Model
            for (label in labels) {
                for (var i = 0; i < this.value[label].length; i++) {
                    table:'Models_Data',
                    keys:{
                        parent:this.id,
                        data:this.value[label].id
                    },
                    values:null
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
