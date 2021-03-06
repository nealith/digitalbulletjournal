var BUJO = function(db,callback){

    var DT = require('../api.js');
    var dao_user = DT.DAO_USER;
    var dao_log = DT.DAO_LOG;
    var dao_topic = DT.DAO_TOPIC;
    var dao_data = DT.DAO_DATA;

    // User

    var user_id;
    var user = new dao_user(db,null,null,'bujo','bujo','bujo','bujo','bujo@bujo.bujo');

    // Log

    var log_id;
    var log = new dao_log(db,null,null,null,false,'bujo');

    // Topic

    var topic_id;
    var topic = new dao_topic(db,null,null,null,'bujo');

    // Tâches

    var task_value = new Object();

    task_value.state = new Array();

    task_value.state.push(new dao_data(db,null,null,null,'bujo','Text','To Do'));
    task_value.state.push(new dao_data(db,null,null,null,'bujo','Text','Planned'));
    task_value.state.push(new dao_data(db,null,null,null,'bujo','Text','Postponed'));
    task_value.state.push(new dao_data(db,null,null,null,'bujo','Text','Done'));
    task_value.state.push(new dao_data(db,null,null,null,'bujo','Text','Cancel'));

    task_value.important = 'Boolean';


    var task = new dao_data(db,null,null,null,'bujo','Model',task_value);

    // Évènements

    var event_value = new Object();

    event_value.date = 'Date';
    event_value.description = 'Text';

    var event = new dao_data(db,null,null,null,'bujo','Model',event_value);

    // Notes

    var note_value = new Object();

    note_value.text = 'Text';
    note_value.inspirationnal = 'Boolean';
    note_value.to_look = 'Boolean';

    var note = new dao_data(db,null,null,null,'bujo','Model',note_value);

    user.update(function(err,args){
        if (!err) {
            log.owner = user.id;
            log.update(function(err,args){
                if (!err) {
                    topic.log = log.id;
                    topic.update(function(err,args){
                        if (!err) {
                            task.topic = topic.id;
                            for (var i = 0; i < task_value.state.length; i++) {
                                task_value.state[i].topic = topic.id
                            }
                            task.update(function(err,args){
                                if (!err) {
                                    event.topic = topic.id;
                                    event.update(function(err,args){
                                        if (!err) {
                                            note.topic = topic.id;
                                            note.update(function(err,args){
                                                if (!err) {
                                                    callback(null,null);
                                                } else {
                                                    callback(err,args);
                                                }
                                            });
                                        } else {
                                            callback(err,args);
                                        }
                                    });
                                } else {
                                    callback(err,args);
                                }
                            });
                        } else {
                            callback(err,args);
                        }
                    });
                } else {
                    callback(err,args);
                }
            });
        } else {
            callback(err,args);
        }
    });


}

BUJO.name = 'Bullet Journal';

module.exports = BUJO;
