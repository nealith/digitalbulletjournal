var socket = io.connect('http://localhost:5110');

var logs;
var topics;
var data;

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
  load_data();
})

socket.on('delete_data', (arg) => {
    if (arg) {
        window.alert(arg);
    }
  load_data();
})

var current_log;
var current_topic;
var current_data;

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
    data = arg;
    list_data = document.getElementById('list_data');
    list_data.innerHTML = '';
    element = document.createElement('li');
    element.innerHTML = '<li class="list-group-header"><h2>Entrees</h2></li>';
    list_data.appendChild(element);
    for (var i = 0; i < data.length; i++) {
        element = document.createElement('li');
        if (data[i].type == 'Compound' || data[i].type == 'Model') {
            element.innerHTML = '<li id='+data[i].id+'class="list-group-item"><button id=button'+data[i].id+' class="btn btn-default"><span class="icon icon-plus"></span><p>Details</p></button><p>'+new Date(data[i].log_datetime).toString()+'</p></li>';


        } else {
            element.innerHTML = '<li id='+data[i].id+' class="list-group-item"><strong>'+data[i].value+'</strong><p>'+new Date(data[i].log_datetime).toString()+'</p></li>';

        }
        list_data.appendChild(element);
        $('#'+data[i].id).click(function(event){
            if ($('#'+current_data) &&  $('#'+current_data).hasClass('selected')) {
                $('#'+current_data).toggleClass('selected');
            }
            $('#'+event.currentTarget.id).toggleClass('selected');
            current_data = event.currentTarget.id
        });
        if (data[i].type == 'Compound' || data[i].type == 'Model') {
            $('#button'+data[i].id).click(function(event){
                var value;
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    var str = new String(event.currentTarget.id);
                    if (str.includes(data[i].id)) {

                        current_data = data[i].id;
                        console.log('select','current_data',current_data);
                        value = data[i].value;
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

function add_log(){
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
    $('#form_log').submit(function(){
        var log = {
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

$('#log_delete').click(function(){
    socket.emit('delete_log', current_log);
})

function add_topic(){
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

$('#topic_add').click(function(){
    add_topic();
})

$('#topic_delete').click(function(){
    socket.emit('delete_topic', current_topic);
})

function add_data(){
    switch_view();
    var dialog = document.getElementById('dialog');
    dialog.innerHTML = '';
    var form = document.createElement('form');
    dialog.appendChild(form);
}

$('#data_add').click(function(){
    add_data();
})

$('#data_delete').click(function(){
    socket.emit('delete_data', current_data);
})

get_logs();
