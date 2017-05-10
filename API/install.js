var fs = require('fs');
var configuration = JSON.parse(fs.readFileSync('conf.json', 'utf8'));

var DB;
var db;

if (configuration.db.type=='sqlite') {
    DB = require('./libdbj_db_sqlite.js');
    db = new SQLITE_DB(configuration.db.sqlite.path);
}

var script = fs.readFileSync('./database_v2.sql', 'utf8');

console.log('Prepare database. . .');
db.db.exec(script,function(err,args){
    if (!err) {
        var m = 0;
        var plugin;
        var recu = function(err,args){
            if (!err) {
                console.log('Done. . .');
                m++;
                if (m == configuration.plugins.length){
                    console.log('Installation finished');
                } else {

                    plugin = require(configuration.plugins[m]);
                    console.log('Install plugin',plugin.name+'. . .');
                    plugin(db,recu);

                }
            } else {
                console.log(err);
            }

        }
        plugin = require('./plugins/'+configuration.plugins[m]);
        console.log('Install plugin',plugin.name+'. . .');
        plugin(db,recu);

    } else {
        console.log(err);
    }
});
