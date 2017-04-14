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
