/*  INTERFACE DB
 *
 *  query(sql, [param, ...], [callback])
 *  begin_transaction()
 *  commit_transaction()
 *  rollback_transaction()
 *  queries(callback)
 */


var sqliteDB = function(database){

    this.sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database('database');

    this.query = db.run;
    this.begin_transaction = function(){
        this.query('BEGIN TRANSACTION');
    }
    this.commit_transaction = function(){
        this.query('COMMIT;');
    }
    this.rollback_transaction = function(){
        this.query('ROLLBACK;');
    }
    this.queries = function(callback){
        this.db.serialize(callback);
    }

}

var dbjDB = function(db){

    this.db = db;
    this.all_queries = JSON.parse(fs.readFileSync('queries.json', 'utf8'));

//==============================================================================
//==============================================================================
//
// UTILS.
//
//==============================================================================
//==============================================================================

    this.utils = new Object();
    this.utils.check = new Object();

    this.utils.check.text = function(obj){
        return true;
    }

    this.utils.check.date = function(obj){
        return true;
    }

    this.utils.check.boolean = function(obj){
        return true;
    }

    this.utils.check.number = function(obj){
        return true;
    }

    this.utils.check.link = function(obj){
        return true;
    }

    this.utils.check.obj = function(obj){
        return true;
    }

    this.utils.check.user = function(obj){
        return true;
    }

    this.utils.check.log = function(obj){
        return true;
    }

    this.utils.check.topic = function(obj){
        return true;
    }

    this.utils.check.id = function(obj){
        return true;
    }

    this.utils.shasum = require('shasum');

//==============================================================================
//==============================================================================
//
// USERS.
//
//==============================================================================
//==============================================================================

    this.users = new Object();

    this.users.add = function(obj,callback){
        if (this.utils.check.user(obj)) {

        } else {
            callback('err::users.add::obj not a user ',null);
        }
    }
    this.users.update = function(obj,callback){
        if (this.utils.check.user(obj)) {

        } else {
            callback('err::users.update::obj not a user ',null);
        }
    }
    this.users.delete = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::users.delete::obj not a id ',null);
        }
    }
    this.users.get = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::users.get::obj not a id ',null);
        }
    }

//==============================================================================
//==============================================================================
//
// LOGS.
//
//==============================================================================
//==============================================================================

    this.logs = new Object();

    this.logs.add = function(obj,callback){
        if (this.utils.check.log(obj)) {

        } else {
            callback('err::logs.add::obj not a log ',null);
        }
    }
    this.logs.update = function(obj,callback){
        if (this.utils.check.log(obj)) {

        } else {
            callback('err::logs.update::obj not a log ',null);
        }
    }
    this.logs.delete = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::logs.delete::obj not a id ',null);
        }
    }
    this.logs.get = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::logs.get::obj not a id ',null);
        }
    }
    this.logs.share = function(obj,callback){
        if (true) {

        } else {
            callback('err::logs.share::obj not expected input ',null);
        }
    }
    this.logs.unshare = function(obj,callback){
        if (true) {

        } else {
            callback('err::logs.unshare::obj not expected input ',null);
        }
    }
    this.logs.update_share_settings = function(obj,callback){
        if (true) {

        } else {
            callback('err::logs.update_share_settings::obj not expected input ',null);
        }
    }

//==============================================================================
//==============================================================================
//
// DATA.
//
//==============================================================================
//==============================================================================

    this.data = new Object();
    this.data.create = new Object();
    this.data.update = new Object();
    this.data.delete = new Object();
    this.data.get = new Object(data.);

    //==========================================================================
    //
    // DATA..TEXT
    //
    //==========================================================================

    this.data.create.text = function(obj,callback){
        if (this.utils.check.text(obj)) {

        } else {
            callback('err::data.create.text::obj not a text ',null);
        }
    }

    this.data.update.text = function(obj,callback){
        if (this.utils.check.text(obj)) {

        } else {
            callback('err::data.update.text::obj not a text ',null);
        }
    }

    this.data.delete.text = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::data.update.text::obj not a id ',null);
        }
    }

    this.data.get.text = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::data.update.text::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..DATE
    //
    //==========================================================================

    this.data.create.date = function(obj,callback){
        if (this.utils.check.date(obj)) {

        } else {
            callback('err::data.create.date::obj not a date ',null);
        }
    }

    this.data.update.date = function(obj,callback){
        if (this.utils.check.date(obj)) {

        } else {
            callback('err::data.update.date::obj not a date ',null);
        }
    }

    this.data.delete.date = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::data.update.date::obj not a id ',null);
        }
    }

    this.data.get.date = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::data.update.date::obj not a id ',null);
        }
    }


    //==========================================================================
    //
    // DATA..BOOLEAN
    //
    //==========================================================================

    this.data.create.boolean = function(obj,callback){
        if (this.utils.check.boolean(obj)) {

        } else {
            callback('err::data.create.boolean::obj not a boolean ',null);
        }
    }

    this.data.update.boolean = function(obj,callback){
        if (this.utils.check.boolean(obj)) {

        } else {
            callback('err::data.update.boolean::obj not a boolean ',null);
        }
    }

    this.data.delete.boolean = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::data.update.boolean::obj not a id ',null);
        }
    }

    this.data.get.boolean = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::data.update.boolean::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..NUMBER
    //
    //==========================================================================

    this.data.create.number = function(obj,callback){
        if (this.utils.check.number(obj)) {

        } else {
            callback('err::data.create.number::obj not a number ',null);
        }
    }

    this.data.update.number = function(obj){
        if (this.utils.check.number(obj)) {

        } else {
            callback('err::data.update.number::obj not a number ',null);
        }
    }

    this.data.delete.number = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::data.update.number::obj not a id ',null);
        }
    }

    this.data.get.number = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::data.update.number::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..LINK
    //
    //==========================================================================

    this.data.create.link = function(obj){
        if (this.utils.check.link(obj)) {

        } else {
            callback('err::data.create.link::obj not a link ',null);
        }
    }

    this.data.update.link = function(obj){
        if (this.utils.check.link(obj)) {

        } else {
            callback('err::data.update.link::obj not a link ',null);
        }
    }

    this.data.delete.link = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::data.update.link::obj not a id ',null);
        }
    }

    this.data.get.link = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::data.update.link::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..COMPLEXE
    //
    //==========================================================================

    this.data.create.complexe = function(obj){
        if (this.utils.check.complexe(obj)) {

        } else {
            callback('err::data.create.complexe::obj not a complexe ',null);
        }
    }

    this.data.update.complexe = function(obj){
        if (this.utils.check.complexe(obj)) {

        } else {
            callback('err::data.update.complexe::obj not a complexe ',null);
        }
    }

    this.data.delete.complexe = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::data.update.complexe::obj not a id ',null);
        }
    }

    this.data.get.complexe = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::data.update.complexe::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..MODEL
    //
    //==========================================================================



    this.data.create.model = function(obj){
        if (this.utils.check.model(obj)) {

        } else {
            callback('err::data.create.model::obj not a model ',null);
        }
    }

    this.data.update.model = function(obj){
        if (this.utils.check.model(obj)) {

        } else {
            callback('err::data.update.model::obj not a model ',null);
        }
    }

    this.data.delete.model = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::data.update.model::obj not a id ',null);
        }
    }

    this.data.get.model = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::data.update.model::obj not a id ',null);
        }
    }


}
