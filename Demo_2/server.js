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
var db = new DB('./test.db');

/*	==========================================================================
 	TEST SECTION
	========================================================================== */

var dao_data = require('./dao_data.js');
var api_dao_data = new dao_data(db);
var dao_user = require('./dao_user.js');
var api_dao_user = new dao_user(db);
var dao_logs = require('./dao_log.js');
var api_dao_logs = new dao_logs(db);


var DT = require('./api.js');

var user;

var dao_user = new DT.DAO_USER(DT.DB);

dao_user.get_all(function(err,args){
    if (!err) {
        for (var i = 0; i < args.length; i++) {
            if(args[i].first_name == 'bujo'){
                dao_user.get(args[i].id,function(err,args){
                    if (!err) {
                        user = args;
                    } else {
                        dao_user.create('demo','demo','demo','demo','demo@demo.demo',function(err,args){
                            if (!err) {
                                user = args;
                            } else {
                                console.log("Can't create the demo user");
                            }
                        });
                    }
                })
            }
        }
    } else {
        console.log(err,args);
    }

})

io.on('connection', function (socket) {

    socket.emit('connection_ready','coucou');

    var emitMessage = function(err,obj){
        data={err:err,obj:obj};
        if (err) {
            data.err = data.err.toString();
        }

    	socket.emit('data',data);
    };

    socket.on('get_logs', (arg) => {
        var dao_log = new DT.DAO_LOG(DT.DB);
        dao_log.get_all(user.id,function(err,args){
            if (!err) {
                socket.emit('set_logs', args)
            } else {
                console.log(err);
            }
        })
    })

	socket.on('create_log', (arg) => {
        var dao_log = new DT.DAO_LOG(DT.DB,null,null,user.id,arg.privacy,arg.title);
		dao_log.update(function(err,args){
            socket.emit('create_log', err)
        })
    })

    socket.on('delete_log', (arg) => {
        var dao_log = new DT.DAO_LOG(DT.DB,arg,function(err,args){
			if (!err && args) {
				args.delete(function(err,args){
		            socket.emit('delete_log', err)
		        })
			} else {
				console.log(err,args);
			}
		})

    })

    socket.on('get_topics', (arg) => {
        var dao_topic = new DT.DAO_TOPIC(DT.DB);
        dao_topic.get_all(arg,function(err,args){
            if (!err) {
                socket.emit('set_topics', args)
            } else {
                console.log(err);
            }
        })
    })

	socket.on('create_topic', (arg) => {
        var dao_topic = new DT.DAO_TOPIC(DT.DB,null,null,arg.log,arg.title);
        dao_topic.update(function(err,args){
            socket.emit('create_topic', err)
        })
    })

    socket.on('delete_topic', (arg) => {
        var dao_topic = new DT.DAO_TOPIC(DT.DB,arg,function(err,args){
			if (!err && args) {
				args.delete(function(err,args){
		            socket.emit('delete_topic', err)
		        })
			} else {
				console.log(err,args);
			}
		})
    })

    socket.on('get_data', (arg) => {
        var dao_data = new DT.DAO_DATA(DT.DB);
        dao_data.get_all_first_level(arg,null,function(err,args){
            if (!err) {
				var rows = args;
				var ret = new Array();
				if (rows.length == 0) {
					socket.emit('set_data', ret);
				} else {
					var m = 0;
					var recu = function(err,args){
						if (!err) {
							ret.push(args);
							m++;
							if (m == rows.length) {
								socket.emit('set_data', ret);
							} else {
								dao_data.get(rows[m].id,recu);
							}

						} else {
							console.log(err);
						}
					}
					dao_data.get(rows[m].id,recu);
				}


            } else {
                console.log(err);
            }
        })
    })

	socket.on('get_data_all', (arg) => {
        var dao_data = new DT.DAO_DATA(DT.DB);
        dao_data.get_all(arg,null,function(err,args){

			if (!err) {
				var rows = args;
				var ret = new Array();
				if (rows.length == 0) {
					socket.emit('set_data', ret);
				} else {
					var m = 0;
					var recu = function(err,args){

						if (!err) {
							ret.push(args);
							m++;
							if (m == rows.length) {
								socket.emit('set_data', ret);
							} else {
								dao_data.get(rows[m].id,recu);
							}
						} else {
							console.log(err);
						}
					}
					dao_data.get(rows[m].id,recu);
				}


            } else {
                console.log(err);
            }
        })
    })

	socket.on('create_data', (arg) => {
        var dao_data = new DT.DAO_DATA(DT.DB,null,null,user.id,arg.title);
		var dao = dao_data.regen(arg);
        dao.update(function(err,args){
            socket.emit('create_data', err)
        })
    })


    socket.on('delete_data', (arg) => {
        var dao_data = new DT.DAO_DATA(DT.DB,arg,function(err,args){
			if (!err && args) {
				args.delete(function(err,args){
		            socket.emit('delete_data', err)
		        })
			} else {
				console.log(err,args);
			}
		})
    })


    socket.on('disconnect', function () {
		io.emit('user disconnected');
	});
});
