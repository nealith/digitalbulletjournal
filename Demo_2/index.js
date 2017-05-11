var socket = io.connect('http://localhost:5110');

var logs;
var topics;
var datas;

var current_log;
var current_topic;
var current_data;
var current_user = 'bujo';

socket.on('connection_ready',function (data) {
  console.log(data);
});

socket.on('set_logs', (arg) => {

  load_logs(arg);
})

socket.on('create_log', (arg) => {
    if (arg) {
        window.alert(arg);
    }
  get_logs();
})

socket.on('delete_log', (arg) => {
    if (arg) {
        window.alert(arg);
    }
  get_logs();
})

socket.on('set_topics', (arg) => {

  load_topics(arg);
})

socket.on('create_topic', (arg) => {
    if (arg) {
        window.alert(arg);
    }
  get_topics();
})

socket.on('delete_topic', (arg) => {
    if (arg) {
        window.alert(arg);
    }
  get_topics();
})

socket.on('set_data', (arg) => {

  load_data(arg);
})

socket.on('create_data', (arg) => {
    if (arg) {
        window.alert(arg);
    }
  get_data();
})

socket.on('delete_data', (arg) => {
    if (arg) {
        window.alert(arg);
    }
  get_data();
})



function get_logs(){
    socket.emit('get_logs', null);
}

function get_topics(){
    socket.emit('get_topics', current_log);
}

function get_data(){
    socket.emit('get_data', current_topic);
}

function see_details(){
    socket.emit('see_details', current_data);
}

function load_logs(arg){
    logs = arg;
    list_logs = document.getElementById('list_logs');
    list_logs.innerHTML = '';
    list_topics = document.getElementById('list_topics');
    list_topics.innerHTML = '';
    list_data = document.getElementById('list_data');
    list_data.innerHTML = '';
    element = document.createElement('li');
    element.innerHTML = '<li class="list-group-header"><h2>Logs</h2></li>';
    list_logs.appendChild(element);
    for (var i = 0; i < logs.length; i++) {
        element = document.createElement('li');
        element.innerHTML = '<li id='+logs[i].id+' class="list-group-item"><strong>'+logs[i].title+'</strong></li>';
        list_logs.appendChild(element);
        $('#'+logs[i].id).click(function(event){
            if ($('#'+current_log) &&  $('#'+current_log).hasClass('selected')) {
                $('#'+current_log).toggleClass('selected');
            }
            $('#'+event.currentTarget.id).toggleClass('selected');
            current_log = event.currentTarget.id;

            console.log('select','current_log',current_log);
            get_topics();
        });

    }
}

function load_topics(arg){
    topics = arg;
    list_topics = document.getElementById('list_topics');
    list_topics.innerHTML = '';
    list_data = document.getElementById('list_data');
    list_data.innerHTML = '';
    element = document.createElement('li');
    element.innerHTML = '<li class="list-group-header"><h2>Topics</h2></li>';
    list_topics.appendChild(element);
    for (var i = 0; i < topics.length; i++) {
        element = document.createElement('li');
        element.innerHTML = '<li id='+topics[i].id+' class="list-group-item"><strong>'+topics[i].title+'</strong></li>';
        list_topics.appendChild(element);
        $('#'+topics[i].id).click(function(event){
            if ($('#'+current_topic) &&  $('#'+current_topic).hasClass('selected')) {
                $('#'+current_topic).toggleClass('selected');
            }
            $('#'+event.currentTarget.id).toggleClass('selected');
            current_topic = event.currentTarget.id;
            console.log('select','current_topic',current_topic);
            get_data()
        });

    }
}



function load_data(arg){
    datas = arg;
    list_data = document.getElementById('list_data');
    list_data.innerHTML = '';
    element = document.createElement('li');
    element.innerHTML = '<li class="list-group-header"><h2>Entrees</h2></li>';
    list_data.appendChild(element);
    for (var i = 0; i < datas.length; i++) {
        element = document.createElement('li');
        if (datas[i].type == 'Compound' || datas[i].type == 'Model') {
            element.innerHTML = '<li id='+datas[i].id+'class="list-group-item"><button id=button'+datas[i].id+' class="btn btn-default"><span class="icon icon-plus"></span><p>Details</p></button><p>'+new Date(datas[i].log_datetime).toString()+'</p></li>';


        } else {
            element.innerHTML = '<li id='+datas[i].id+' class="list-group-item"><strong>'+datas[i].value+'</strong><p>'+new Date(datas[i].log_datetime).toString()+'</p></li>';

        }
        list_data.appendChild(element);
        $('#'+datas[i].id).click(function(event){
            if ($('#'+current_data) &&  $('#'+current_data).hasClass('selected')) {
                $('#'+current_data).toggleClass('selected');
            }
            $('#'+event.currentTarget.id).toggleClass('selected');

            current_data = event.currentTarget.id
            console.log('select','current_data',current_data);
        });
        if (datas[i].type == 'Compound' || datas[i].type == 'Model') {
            $('#button'+datas[i].id).click(function(event){
                var value;
                for (var i = 0; i < datas.length; i++) {
                    var str = new String(event.currentTarget.id);
                    if (str.includes(data[i].id)) {

                        current_data = datas[i].id;

                        value = datas[i].value;
                        break;
                    }
                }
                window.alert(JSON.stringify(value));
            })
        }


    }
}

function switch_view(){
    $('#content').toggleClass('show');
    $('#content').toggleClass('hide');
    $('#dialog').toggleClass('show');
    $('#dialog').toggleClass('hide');
}

function dialog_log(){
    switch_view();

    var dialog = document.getElementById('dialog');
    dialog.innerHTML = '';

    var form = document.createElement('form');
    form.id='form_log';
    dialog.appendChild(form);

    var title = document.createElement('div');
    title.innerHTML = '<div class="form-group"><label>Title</label><textarea class="form-control" rows="1" id="form_log_title"></textarea></div>';
    form.appendChild(title);

    var privacy = document.createElement('div');
    privacy.innerHTML = '<div class="checkbox"><label><input type="checkbox" id="form_log_privacy">Public</label></div>';
    form.appendChild(privacy);

    var actions = document.createElement('div');
    actions.innerHTML =   '<div class="form-actions"><button type="submit" class="btn btn-form btn-default">Cancel</button><button type="submit" class="btn btn-form btn-primary">OK</button></div>';
    form.appendChild(actions);
}

function add_log(){
    dialog_log()
    $('#form_log').submit(function(){
        var log = {
            id:current_log,
            title: document.getElementById("form_log_title").value,
            privacy: !document.getElementById("form_log_privacy").value
        }
        socket.emit('create_log', log);
        switch_view();
        return false;
    });

}

$('#log_add').click(function(){
    add_log();
})

$('#log_edit').click(function(){
    edit_log();
})

$('#log_delete').click(function(){
    socket.emit('delete_log', current_log);
})

function dialog_topic(){
    switch_view();

    var dialog = document.getElementById('dialog');
    dialog.innerHTML = '';

    var form = document.createElement('form');
    form.id='form_topic';
    dialog.appendChild(form);

    var title = document.createElement('div');
    title.innerHTML = '<div class="form-group"><label>Title</label><textarea class="form-control" rows="1" id="form_topic_title"></textarea></div>';
    form.appendChild(title);

    var actions = document.createElement('div');
    actions.innerHTML =   '<div class="form-actions"><button type="submit" class="btn btn-form btn-default">Cancel</button><button type="submit" class="btn btn-form btn-primary">OK</button></div>';
    form.appendChild(actions);
}

function add_topic(){
    dialog_topic()
    $('#form_topic').submit(function(){
        console.log('current_log',current_log);
        var topic = {
            log: current_log,
            title: document.getElementById("form_topic_title").value
        }
        socket.emit('create_topic', topic);
        switch_view();
        return false;
    });
}

function edit_topic(){
    dialog_topic()
    $('#form_topic').submit(function(){
        console.log('current_log',current_log);
        var topic = {
            id: current_topic,
            log: current_log,
            title: document.getElementById("form_topic_title").value
        }
        socket.emit('update_topic', topic);
        switch_view();
        return false;
    });
}

$('#topic_add').click(function(){
    add_topic();
})

$('#topic_edit').click(function(){
    edit_topic();
})

$('#topic_delete').click(function(){
    socket.emit('delete_topic', current_topic);
})

function dialog_data(){
    switch_view();

    var dialog = document.getElementById('dialog');
    dialog.innerHTML = '';

    var form = document.createElement('form');
    form.id='form_data';
    dialog.appendChild(form);

    var type = document.createElement('div');
    type.innerHTML = '<div class="form-group"><label>Type</label><select id=form_data_type class="form-control"><option>Text</option><option>Date</option><option>Boolean</option><option>Number</option><option>Compound</option><option>Model</option> select></div>';
    form.appendChild(type);

    var value = document.createElement('div');
    value.innerHTML = '<div class="form-group"><label>Value</label><textarea class="form-control" rows="10" id="form_data_value"></textarea></div>';
    form.appendChild(value);

    var actions = document.createElement('div');
    actions.innerHTML =   '<div class="form-actions"><button type="submit" class="btn btn-form btn-default">Cancel</button><button type="submit" class="btn btn-form btn-primary">OK</button></div>';
    form.appendChild(actions);
}

function get_data_from_form(){
    var type = document.getElementById("form_data_type").value;
    var value;
    var tmp_value = document.getElementById("form_data_value").value;

    if (type == 'Compound' || type == 'Model') {
        value = JSON.parse(tmp_value);
        function parse(value){
            if (type == 'Compound') {
                for (label in value) {
                    value[label].user = current_user;
                    value[label].topic = current_topic;
                    value[label].value = parse(value[label].value);
                }
            } else if (type == 'Model') {
                for (label in value) {
                    if (value[label] instanceof Array) {
                        for (var i = 0; i < value[label].length; i++) {
                            value[label][i].user = current_user;
                            value[label][i].topic = current_topic;
                            value[label][i].value = parse(value[label][i].value);
                        }
                    }
                }
            }
            return value;
        }

        value = parse(value);
    } else {
        if (type == 'Number' || type == 'Date') {
            value = Number(tmp_value);
        } else if (type == "Boolean") {
            value = Boolean(tmp_value);
        } else {
            value = tmp_value;
        }
    }



    var data = {
        user: current_user,
        topic: current_topic,
        value: value,
        type: type
    }

    return data;
}

function add_data(){
    dialog_data();
    $('#form_data').submit(function(){
        console.log(get_data_from_form());
        socket.emit('create_data', get_data_from_form());
        switch_view();
        return false;
    });
}

function edit_data(){
    dialog_data();
    var dao;
    for (var i = 0; i < datas.length; i++) {
        if(datas[i].id == current_data){
            dao = datas[i];
        }
    }
    document.getElementById("form_data_type").value = dao.type;
    var value;
    if (dao.type == 'Compound' || dao.type == 'Model') {
        function parse(tmp_value){
            var ret_value = new Object();
            if (dao.type == 'Compound') {
                for (label in tmp_value) {
                    ret_value[label] = new Object();
                    ret_value[label][i].id = tmp_value[label][i].id;
                    ret_value[label][i].type = tmp_value[label][i].type;
                    ret_value[label].value = parse(tmp_value[label].value);
                }
            } else if (dao.type == 'Model') {
                for (label in tmp_value) {
                    if (tmp_value[label] instanceof Array) {
                        ret_value[label] = new Array();
                        for (var i = 0; i < tmp_value[label].length; i++) {
                            ret_value[label][i] = new Object();
                            ret_value[label][i].id = tmp_value[label][i].id;
                            ret_value[label][i].type = tmp_value[label][i].type;
                            ret_value[label][i].value = parse(tmp_value[label][i].value);
                        }
                    } else {
                        ret_value[label] = tmp_value[label]
                    }
                }
            }
        }

        value = parse(dao.value);
    } else {
        if (dao.type == 'Number' || dao.type == 'Date') {
            value = Number(dao.value);
        } else if (dao.type == "Boolean") {
            value = Boolean(dao.value);
        } else {
            value = dao.value;
        }
    }

    document.getElementById("form_data_value").value = value;
    $('#form_data').submit(function(){
        var data = get_data_from_form();
        data.id = current_data;
        for (var i = 0; i < datas.length; i++) {
            if(datas[i].id == current_data){
                data.log_datetime = datas[i].log_datetime;
            }
        }
        socket.emit('update_data', data);
        switch_view();
        return false;
    });
}

$('#data_add').click(function(){
    add_data();
})

$('#data_edit').click(function(){
    edit_data();
})

$('#data_delete').click(function(){
    socket.emit('delete_data', current_data);
})

get_logs();
