var DAO_Logs = function(db,id){

    this.db = db;
    if(id){
        var obj = this.get(id);
        this = obj;
    }
}


DAO_Logs.prototype.erase = function (err,dao) {
    if (!err) {
        this.id = dao.id;
        this.title = args.title;
        this.creation_date = args.creation_date;
        this.privacy = args.privacy;
        this.owner = args.owner;
    }
}

DAO_Logs.prototype.create = function(owner,privacy,title,callback){

    dao = new DAO_Logs(this.db);
    dao.callback = callback;
    dao.creation_date = Date.now();
    dao.owner = owner;
    dao.title = title;
    dao.privacy = privacy;
    var stmt = this.db.stmt(true);
    stmt.insert({
        table:'Logs',
        keys:null,
        values:{
            creation_date:dao.creation_date,
            owner:dao.owner,
            title:dao.title,
            privacy:dao.privacy
        }
    });
    stmt.exec();
}

DAO_Logs.prototype.create_callback = function (err,args) {

    if (!err) {
        this.callback(err,this);
    }
}

DAO_Logs.prototype.update = function(stmt,callback){

    if(!stmt){stmt = this.db.stmt(true);}



}

DAO_Logs.prototype.delete = function(stmt,finalize){

    // A voir : Suppression de tout les éléments liés au journal

}


DAO_Logs.prototype.get = function(id,callback){

    dao = new DAO_Logs(this.db);
    dao.callback = callback
    dao.lock = true;

    this.db.select({
        table:'Logs',
        keys:{
            id:id
        },
        values:null
    },function(err,args){
        if(args){

            // List of data
            console.log(args);
            dao.title = args[0].title;
            dao.creation_date = args[0].creation_date;
            dao.privacy = args[0].privacy;
            dao.owner = args[0].owner;
            dao.id = args[0].id;
            dao.callback(null,dao);
        }else{
            dao.lock = false;
            callback(err,null);
        }
    });

}

module.exports = DAO_Logs;
