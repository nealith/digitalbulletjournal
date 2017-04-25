var DAO_Logs = function(db,id){

    this.db = db;
    if(id){
        var obj = this.get(id);
        this = obj;
    }
}


DAO_Logs.prototype.create = function(args,stmt){

}

DAO_Logs.prototype.update = function(stmt,callback){

    if(!stmt){stmt = this.db.stmt(true);}



}

DAO_Logs.prototype.delete = function(stmt,finalize){

    // A voir : Suppression de tout les éléments liés au journal

}

DAO_Logs.prototype.get_Logs = function(err,args){
    if(args){

        // List of data
        this.title = args.title;
        this.creation_date = args.creation_date;
        this.privacy = args.privacy;
        this.owner = args.owner;

    }else{
        this.callback("This user doesn't exist", null);
    }
}


DAO_Logs.prototype.get = function(id,callback){

    dao = new DAO_Logs(this.db);
    dao.callback = callback
    dao.lock = true;

    this.db.select({
        table:'Logs',
        keys:{
            id:this.id
        },
        values:null
    },dao.get_Logs);

}

module.exports = DAO_Logs;
