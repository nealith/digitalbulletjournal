/*  INTERFACE DB
 *
 *  create
 *  update
 *  select
 *  begin_transaction()
 *  commit_transaction()
 *  rollback_transaction()
 *
 */

/* args specs :
 *
 * args {
 *  table : "name"
 *  keys : {} (null for create)
 *  values : {} (null for delete and select)
 * }
 */

var DB_UTILS = function(){

}

DB_UTILS.prototype.insert = function (args) {
    var query = new Object();
    query.sql = 'INSERT INTO '+args.table+' (';
    var attr_values = Object.keys(args.values);
    var attr_values_size = attr_values.length;
    var i = 1;
    var attr_values_query = '';
    var values_query = '';
    var values = new Object();
    for (attr_value in args.values) {
        if (i == attr_values_size) {
            attr_values_query += (attr_value+')');
            values_query += ('$'+attr_value+')');
            values['$'+attr_value] = args.values[attr_value];
        } else {
            attr_values_query += (attr_value+',');
            values_query += ('$'+attr_value+',');
            values['$'+attr_value] = args.values[attr_value];
        }
        i++;
    }
    query.sql += (attr_values_query+' VALUES('+values_query+';');
    query.params = values;
    return query;
};

DB_UTILS.prototype.delete = function (args) {
    var query = new Object();
    query.sql = 'DELETE FROM '+args.table+' WHERE ';
    var attr_keys = Object.keys(args.keys);
    var attr_keys_size = attr_keys.length;
    var i = 1;
    var keys_query = '';
    var keys = new Object();
    for (attr_key in args.values) {
        if (i == attr_keys_size) {
            keys_query += (attr_key+' = $'+attr_key);
            keys['$'+attr_key] = args.keys[attr_key];
        } else {
            keys_query += (attr_key+' = $'+attr_key+' AND ');
            keys['$'+attr_key] = args.keys[attr_key];
        }
        i++;
    }
    query.sql += (keys_query+';');
    query.params = keys;
    return query;
};

DB_UTILS.prototype.update = function (args) {
    var query = new Object();
    query.sql = 'UPDATE '+args.table+' SET ';
    var attr_keys = Object.keys(args.keys);
    var attr_keys_size = attr_keys.length;
    var i = 1;
    var keys_query = '';
    var keys_values = new Object();
    for (attr_key in args.keys) {
        if (i == attr_keys_size) {
            keys_query += (attr_key+' = $'+attr_key);
            keys_values['$'+attr_key] = args.keys[attr_key];
        } else {
            keys_query += (attr_key+' = $'+attr_key+' AND ');
            keys_values['$'+attr_key] = args.keys[attr_key];
        }
        i++;
    }

    var attr_values = Object.keys(args.values);
    var attr_values_size = attr_values.length;
    var k = 1;
    var values_query = '';
    for (attr_value in args.values) {
        if (k == attr_values_size) {
            values_query += (value+' = $'+value);
            keys_values['$'+value] = args.values[value];
        } else {
            values_query += (value+' = $'+value+',');
            keys_values['$'+value] = args.values[value];
        }
        k++;
    }


    query.sql += (values_query+' WHERE '+keys_query+';');
    query.params = keys_values;
    return query;
};

DB_UTILS.prototype.select = function (args) {
    var query = new Object();
    query.sql = 'SELECT * FROM '+args.table+' WHERE ';
    var attr_keys = Object.keys(args.keys);
    var attr_keys_size = attr_keys.length;
    var i = 1;
    var keys_query = '';
    var keys = new Object();
    for (attr_key in args.keys) {
        if (i == attr_keys_size) {
            keys_query += (attr_key+' = $'+attr_key);
            keys['$'+attr_key] = args.keys[attr_key];
        } else {
            keys_query += (attr_key+' = $'+attr_key+' AND ');
            keys['$'+attr_key] = args.keys[attr_key];
        }
        i++;
    }
    query.sql += (keys_query+';');
    query.params = keys;
    return query;
};

DB_UTILS.prototype.to_sql = function(args){
    var sql = new String(args.sql);
    var keys = Object.keys(args.params);
    for (key in args.params) {
        if (typeof args.params[key] == 'string') {
            sql = sql.replace(key,('"'+args.params[key]+'"'));
        } else {
            sql = sql.replace(key,args.params[key]);
        }
    }
    return sql;
}

module.exports = DB_UTILS;
