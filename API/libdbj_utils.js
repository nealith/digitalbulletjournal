//==============================================================================
//==============================================================================
//
// UTILS.
//
//==============================================================================
//==============================================================================

var DBJ_UTILS = new function(){

    this.check = new Object();

    this.check.text = function(obj){
        return true;
    }

    this.check.date = function(obj){
        return true;
    }

    this.check.boolean = function(obj){
        return true;
    }

    this.check.number = function(obj){
        return true;
    }

    this.check.link = function(obj){
        return true;
    }

    this.check.obj = function(obj){
        return true;
    }

    this.check.user = function(obj){
        return true;
    }

    this.check.log = function(obj){
        return true;
    }

    this.check.topic = function(obj){
        return true;
    }

    this.check.id = function(obj){
        return true;
    }

    this.shasum = require('shasum');

}

module.exports = DBJ_UTILS;
