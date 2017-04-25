var DAO_User = function(db,id){

    this.db = db;
    if(id){
        var obj = this.get(id);
        this = obj;
    }
}

DAO_User.prototype.erase = function (err,dao) {
    if (!err) {
        this.id = this.id;
        this.first_name = args.first_name;
        this.last_name = args.last_name;
        this.nick_name = args.nick_name;
        this.creation_date = args.creation_date;
        this.e_mail = args.e_mail;
    }
}

DAO_User.prototype.create = function(first_name,password,nick_name,last_name,e_mail,callback){

    dao = new DAO_User(this.db);
    dao.callback = callback;
    dao.creation_date = Date.now();
    dao.first_name = first_name;
    dao.last_name = last_name;
    dao.nick_name = nick_name;
    dao.password = password;
    dao.e_mail = e_mail;
    var stmt = this.db.stmt(true);
    stmt.insert({
        table:'Users',
        keys:null,
        values:{
            creation_date:dao.creation_date,
            first_name:dao.first_name,
            last_name:dao.last_name,
            nick_name:dao.nick_name,
            e_mail:dao.e_mail,
            password:dao.password
        }
    });
    stmt.exec();
}

DAO_User.prototype.create_callback = function (err,args) {

    if (!err) {
        this.callback(err,this);
    }
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
