var DAO_Data = function(db,id){

    this.db = db;
    this.async = require("async");
    if (id) {
        var obj = this.get(id);
        this = obj;
    }

}

DAO_Data.prototype.create = function (type,value) {

}

DAO_Data.prototype.update = function () {

}

DAO_Data.prototype.delete = function () {
    async.waterfall([
        function(callback) {
            callback(null, 'one', 'two');
        },
        function(arg1, arg2, callback) {
            // arg1 now equals 'one' and arg2 now equals 'two'
            callback(null, 'three');
        },
        function(arg1, callback) {
            // arg1 now equals 'three'
            callback(null, 'done');
        }
    ], function (err, result) {
        // result now equals 'done'
    });
}

DAO_Data.prototype.get_Data = function(args,callback){
    if (args) {
        this.log_datetime = args.log_datetime
        this.topic = args.topic
        this.user = args.user
        this.type = args.type
        if (type == 'Complexe') {
            this.get_Data_Type = this.get_Data_Type_Complexe
            this.update = this.update_Complexe
        } else if (type == 'Model'){
            this.get_Data_Type = this.get_Data_Type_Model
            this.update = this.update_Model
        } else {
            this.get_Data_Type = this.get_Data_Type_Value
            this.update = this.update_Value
        }


        this.db.get('SELECT * FROM Data WHERE id=$id',{$id:this.id},this.get_Data_Type);
    } else {
        this.callback("this data does'nt exist",null)
    }


}

DAO_Data.prototype.get_Data_Type_Value = function(args,callback){
    if (args) {
        this.value = args.value
        this.callback(null,this);
        this.callback = null;
    } else {
        this.callback("this data does'nt exist",null)
    }


}

DAO_Data.prototype.get_Data_Type_Complexe = function(args,callback){
    if (args) {

        this.callback(null,this);
        this.callback = null;
    } else {
        this.callback("this data does'nt exist",null)
    }


}

DAO_Data.prototype.get_Data_Type_Model = function(args,callback){
    if (args) {

        this.callback(null,this);
        this.callback = null;
    } else {
        this.callback("this data does'nt exist",null)
    }


}

DAO_Data.prototype.get = function (id,callback) {

    dao = new DAO_Data(this.db);
    dao.callback = callback

    dao.db.get('SELECT * FROM Data WHERE id=$id',{$id:id},dao.get_Data);
}

DAO_Data.prototype.get_all_type = function () {

}

DAO_Data.prototype.get_all_data = function () {

}

module.exports = DAO_Data;
