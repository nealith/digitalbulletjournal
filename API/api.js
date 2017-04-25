/*	==========================================================================
 	SERVER CONFIGURATION
	========================================================================== */

var http = require('http');
var server = http.createServer(function(req, res){
	console.log('Printed page');
});

var port = process.env.PORT || 5110;
server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

var io = require('socket.io').listen(server);

/*	==========================================================================
 	SQL CONFIGURATION
	========================================================================== */

var db = require('./libdbj_db_sqlite.js');

/*	==========================================================================
 	TEST SECTION
	========================================================================== */

/*
    user:

    id
    password
    first_name
    last_name
    nick_name
    creation_date
    e_mail

    log:

    id
    creation_date
    owner
    privacy
    title

    log_user

    user
    log
    writting_rights
    admin_rights
    adding_date

    topic

    id
    title
    log*/

var dao_data = require('./dao_data.js');
var api_dao_data = new dao_data(db);




var sync = require('sync');

io.on('connection', function (socket) {

    var emitMessage = function(err,obj){

    	socket.emit('data',{err:err,obj:obj});

    };

    socket.on('add', function (data) {
        api_dao_data.create(data.topic,data.user,data.type,data.value,emitMessage);
	});
    socket.on('get', function (data) {
        api_dao_data.create(data.id,emitMessage);
	});
    socket.on('delete', function (data) {
        data.delete(emitMessage);
	});
    socket.on('update', function (data) {
        data.update(emitMessage);
	});
    socket.on('disconnect', function () {
		io.emit('user disconnected');
	});
});
