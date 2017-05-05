var BUJO = function(db,dao_data,dao_user,dao_log,dao_topic){

    // User

    var user_id;
    var user = new dao_user(db,null,'bujo','bujo','bujo','bujo','bujo@bujo.bujo');

    // Log

    var log_id;
    var log = new dao_log(db,null,null,false,'bujo');

    // Topic

    var topic_id;
    var topic = new dao_topic(db,null,null,'bujo');

    // Tâches

    var task_value = new Object();

    task_value.state = new Array();

    task_value.state.push(new dao_data(db,null,'bujo','bujo','Text','To Do'));
    task_value.state.push(new dao_data(db,null,'bujo','bujo','Text','Planned'));
    task_value.state.push(new dao_data(db,null,'bujo','bujo','Text','Postponed'));
    task_value.state.push(new dao_data(db,null,'bujo','bujo','Text','Done'));
    task_value.state.push(new dao_data(db,null,'bujo','bujo','Text','Cancel'));

    task_value.important = 'Boolean';


    var task = new dao_data(db,null,null,null,'Model',task_value))

    // Évènements

    var event_value = new Object();

    event_value.date = 'Date';
    event_value.description = 'Text';

    var event = new dao_data(db,null,null,null,'Model',event_value);

    // Notes

    var ret = new Object

    return ret;

}

module.exports = BUJO;
