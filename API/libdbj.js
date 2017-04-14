var dbjDB = function(db){

    this.db = db;
    //this.all_queries = JSON.parse(fs.readFileSync('queries.json', 'utf8'));
    this.data = require('./libdbj_data.js');
    this.ult = require('./libdbj_ult.js');
    this.utils = require('./libdbj_utils.js');

}
