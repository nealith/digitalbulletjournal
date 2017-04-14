var DBJ_DATA = function(){





//==============================================================================
//==============================================================================
//
// DATA.
//
//==============================================================================
//==============================================================================

    this.create = new Object();
    this.update = new Object();
    this.delete = new Object();
    this.get = new Object();

    //==========================================================================
    //
    // DATA..TEXT
    //
    //==========================================================================

    this.create.text = function(obj,callback){
        if (this.utils.check.text(obj)) {

        } else {
            callback('err::create.text::obj not a text ',null);
        }
    }

    this.update.text = function(obj,callback){
        if (this.utils.check.text(obj)) {

        } else {
            callback('err::update.text::obj not a text ',null);
        }
    }

    this.delete.text = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::update.text::obj not a id ',null);
        }
    }

    this.get.text = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::update.text::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..DATE
    //
    //==========================================================================

    this.create.date = function(obj,callback){
        if (this.utils.check.date(obj)) {

        } else {
            callback('err::create.date::obj not a date ',null);
        }
    }

    this.update.date = function(obj,callback){
        if (this.utils.check.date(obj)) {

        } else {
            callback('err::update.date::obj not a date ',null);
        }
    }

    this.delete.date = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::update.date::obj not a id ',null);
        }
    }

    this.get.date = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::update.date::obj not a id ',null);
        }
    }


    //==========================================================================
    //
    // DATA..BOOLEAN
    //
    //==========================================================================

    this.create.boolean = function(obj,callback){
        if (this.utils.check.boolean(obj)) {

        } else {
            callback('err::create.boolean::obj not a boolean ',null);
        }
    }

    this.update.boolean = function(obj,callback){
        if (this.utils.check.boolean(obj)) {

        } else {
            callback('err::update.boolean::obj not a boolean ',null);
        }
    }

    this.delete.boolean = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::update.boolean::obj not a id ',null);
        }
    }

    this.get.boolean = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::update.boolean::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..NUMBER
    //
    //==========================================================================

    this.create.number = function(obj,callback){
        if (this.utils.check.number(obj)) {

        } else {
            callback('err::create.number::obj not a number ',null);
        }
    }

    this.update.number = function(obj){
        if (this.utils.check.number(obj)) {

        } else {
            callback('err::update.number::obj not a number ',null);
        }
    }

    this.delete.number = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::update.number::obj not a id ',null);
        }
    }

    this.get.number = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::update.number::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..LINK
    //
    //==========================================================================

    this.create.link = function(obj){
        if (this.utils.check.link(obj)) {

        } else {
            callback('err::create.link::obj not a link ',null);
        }
    }

    this.update.link = function(obj){
        if (this.utils.check.link(obj)) {

        } else {
            callback('err::update.link::obj not a link ',null);
        }
    }

    this.delete.link = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::update.link::obj not a id ',null);
        }
    }

    this.get.link = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::update.link::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..COMPLEXE
    //
    //==========================================================================

    this.create.complexe = function(obj){
        if (this.utils.check.complexe(obj)) {

        } else {
            callback('err::create.complexe::obj not a complexe ',null);
        }
    }

    this.update.complexe = function(obj){
        if (this.utils.check.complexe(obj)) {

        } else {
            callback('err::update.complexe::obj not a complexe ',null);
        }
    }

    this.delete.complexe = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::update.complexe::obj not a id ',null);
        }
    }

    this.get.complexe = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::update.complexe::obj not a id ',null);
        }
    }

    //==========================================================================
    //
    // DATA..MODEL
    //
    //==========================================================================



    this.create.model = function(obj){
        if (this.utils.check.model(obj)) {

        } else {
            callback('err::create.model::obj not a model ',null);
        }
    }

    this.update.model = function(obj){
        if (this.utils.check.model(obj)) {

        } else {
            callback('err::update.model::obj not a model ',null);
        }
    }

    this.delete.model = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::update.model::obj not a id ',null);
        }
    }

    this.get.model = function(obj){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::update.model::obj not a id ',null);
        }
    }

}
module.exports = DBJ_DATA;
