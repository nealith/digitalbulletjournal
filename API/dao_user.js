var DAO_User = function(db,id){

    this.db = db;
    if(id){
        var obj = this.get(id);
        this = obj;
    }
}


DAO_User.prototype.create = function(args,stmt){

}

DAO_User.prototype.update = function(stmt,callback){

    if(!stmt){stmt = this.db.stmt(true);}

    

}

DAO_User.prototype.delete = function(stmt,finalize){

    // A voir : Suppression de tout les éléments liés à l'utilisateur

}

DAO_User.prototype.get_User = function(err,args){
    if(args){

        // List of data
        this.first_name = args.first_name;
        this.last_name = args.last_name;
        this.nick_name = args.nick_name;
        this.creation_date = args.creation_date;
        this.e_mail = args.e_mail;

    }else{
        this.callback("This user doesn't exist", null);
    }
}


DAO_User.prototype.get = function(id,callback){

    dao = new DAO_User(this.db);
    dao.callback = callback
    dao.lock = true;

    this.db.select({
        table:'Users',
        keys:{
            id:this.id
        },
        values:null
    },dao.get_User);

}

module.exports = DAO_User;
