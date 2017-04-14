//==============================================================================
//==============================================================================
//
// DATA.
//
//==============================================================================
//==============================================================================

var DBJ_DATA = function(){

    fs = require('fs');
    this.queries = JSON.parse(fs.readFileSync('queries_data.json', 'utf8'));

    this.text = new Object();
    this.date = new Object();
    this.boolean = new Object();
    this.number = new Object();
    this.link = new Object();
    this.complexe = new Object();
    this.model = new Object();

    // get all of topic
    this.get_aot = function(obj,callback){

        if (this.utils.check.id(obj)) {

        } else {
            callback('err::get_aot::obj not a id ',null);
        }

    }

    // get all of log
    this.get_aol = function(obj,callback){

        if (this.utils.check.id(obj)) {

        } else {
            callback('err::get_aol::obj not a id ',null);
        }

    }

    // get all of user
    this.get_aou = function(obj,callback){

        if (this.utils.check.id(obj)) {

        } else {
            callback('err::get_aou::obj not a id ',null);
        }

    }

    // interne use
    // get all of user and a log
    this.get_aou = function(obj,callback){

    }




    //==========================================================================
    //
    // DATA..TEXT
    //
    //==========================================================================

    this.text.create = function(obj,callback){
        if (this.utils.check.text(obj)) {

        } else {
            callback('err::text.create::obj not a text ',null);
        }
    }

    this.text.update = function(obj,callback){
        if (this.utils.check.text(obj)) {

        } else {
            callback('err::text.update::obj not a text ',null);
        }
    }

    this.text.delete = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::text.delete::obj not a id ',null);
        }
    }

    this.text.get = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::text.get::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..DATE
    //
    //==========================================================================

    this.date.create = function(obj,callback){
        if (this.utils.check.date(obj)) {

        } else {
            callback('err::date.create::obj not a date ',null);
        }
    }

    this.date.update = function(obj,callback){
        if (this.utils.check.date(obj)) {

        } else {
            callback('err::date.update::obj not a date ',null);
        }
    }

    this.date.delete = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::date.delete::obj not a id ',null);
        }
    }

    this.date.get = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::date.get::obj not a id ',null);
        }
    }


    //==========================================================================
    //
    // DATA..BOOLEAN
    //
    //==========================================================================

    this.boolean.create = function(obj,callback){
        if (this.utils.check.boolean(obj)) {

        } else {
            callback('err::boolean.create::obj not a boolean ',null);
        }
    }

    this.boolean.update = function(obj,callback){
        if (this.utils.check.boolean(obj)) {

        } else {
            callback('err::boolean.update::obj not a boolean ',null);
        }
    }

    this.boolean.delete = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::boolean.delete::obj not a id ',null);
        }
    }

    this.boolean.get = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::boolean.get::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..NUMBER
    //
    //==========================================================================

    this.number.create = function(obj,callback){
        if (this.utils.check.number(obj)) {

        } else {
            callback('err::number.create::obj not a number ',null);
        }
    }

    this.number.update = function(obj){
        if (this.utils.check.number(obj)) {

        } else {
            callback('err::number.update::obj not a number ',null);
        }
    }

    this.number.delete = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::number.delete::obj not a id ',null);
        }
    }

    this.number.get = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::number.get::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..LINK
    //
    //==========================================================================

    this.link.create = function(obj){
        if (this.utils.check.link(obj)) {

        } else {
            callback('err::link.create::obj not a link ',null);
        }
    }

    this.link.update = function(obj){
        if (this.utils.check.link(obj)) {

        } else {
            callback('err::link.update::obj not a link ',null);
        }
    }

    this.link.delete = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::link.delete::obj not a id ',null);
        }
    }

    this.link.get = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::link.get::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..COMPLEXE
    //
    //==========================================================================

    this.complexe.create = function(obj){
        if (this.utils.check.complexe(obj)) {

        } else {
            callback('err::complexe.create::obj not a complexe ',null);
        }
    }

    this.complexe.update = function(obj){
        if (this.utils.check.complexe(obj)) {

        } else {
            callback('err::complexe.update::obj not a complexe ',null);
        }
    }

    this.complexe.delete = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::complexe.delete::obj not a id ',null);
        }
    }

    this.complexe.get = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::complexe.get::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..MODEL
    //
    //==========================================================================



    this.model.create = function(obj){
        if (this.utils.check.model(obj)) {

        } else {
            callback('err::model.create::obj not a model ',null);
        }
    }

    this.model.update = function(obj){
        if (this.utils.check.model(obj)) {

        } else {
            callback('err::model.update::obj not a model ',null);
        }
    }

    this.model.delete = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::model.delete::obj not a id ',null);
        }
    }

    this.model.get = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::model.get::obj not a id ',null);
        }
    }

}
module.exports = DBJ_DATA;
