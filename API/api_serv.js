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

var DB = require('./libdbj_db_sqlite.js');
var db = new DB('./test.db')

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
var dao_user = require('./dao_user.js');
var api_dao_user = new dao_user(db);
var dao_logs = require('./dao_log.js');
var api_dao_logs = new dao_logs(db);


var sync = require('sync');

io.on('connection', function (socket) {

    socket.emit('connection_ready','coucou');

    var emitMessage = function(err,obj){
        data={err:err,obj:obj};
        if (err) {
            data.err = data.err.toString();
        }

    	socket.emit('data',data);
    };

    socket.on('add', function (data) {
        if(data){
            api_dao_data.create(data.topic,data.user,data.type,data.value,emitMessage);
        }

	});
    socket.on('get', function (data) {
        if(data){
            api_dao_data.get(data.id,emitMessage);
        }

	});
	socket.on('get_User', function (data) {
		console.log('Test Users');
        if(data){
            api_dao_user.get(data.id,emitMessage);
        }
	});
	socket.on('get_Logs', function (data) {
		console.log('Test Logs');
        if(data){
            api_dao_logs.get(data.id,emitMessage);
        }
	});
    socket.on('delete', function (data) {
        if(data){
            var tmp = api_dao_data.regen(null,data);
            tmp.delete(emitMessage);
        }

	});
    socket.on('update', function (data) {
        if(data){
            var tmp = api_dao_data.regen(null,data);
            tmp.update(emitMessage);
        }

	});
    socket.on('disconnect', function () {
		io.emit('user disconnected');
	});
});
