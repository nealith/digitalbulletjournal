var ult = new function(){

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
            db.
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

//==============================================================================
//==============================================================================
//
// USERS_LOGS.
//
//==============================================================================
//==============================================================================

    this.users_logs = new Object();
    this.users_logs.share = function(obj,callback){
        if (true) {

        } else {
            callback('err::users_logs.share::obj not expected input ',null);
        }
    }
    this.users_logs.unshare = function(obj,callback){
        if (true) {

        } else {
            callback('err::users_logs.unshare::obj not expected input ',null);
        }
    }
    this.users_logs.update_share_settings = function(obj,callback){
        if (true) {

        } else {
            callback('err::users_logs.update_share_settings::obj not expected input ',null);
        }
    }

//==============================================================================
//==============================================================================
//
// TOPICS.
//
//==============================================================================
//==============================================================================

    this.topics = new Object();
    this.topics.add = function(obj,callback){
        if (this.utils.check.topic(obj)) {
            db.
        } else {
            callback('err::topics.add::obj not a log ',null);
        }
    }
    this.topics.update = function(obj,callback){
        if (this.utils.check.topic(obj)) {

        } else {
            callback('err::topics.update::obj not a log ',null);
        }
    }
    this.topics.delete = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::topics.delete::obj not a id ',null);
        }
    }
    this.topics.get = function(obj,callback){
        if (this.utils.check.id(obj)) {

        } else {
            callback('err::topics.get::obj not a id ',null);
        }
    }
}
