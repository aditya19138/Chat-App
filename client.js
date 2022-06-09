var socket = io();

var form = document.getElementById('form');
var input = document.getElementById('input');
var ul = document.getElementById("messages");

const append = (msg, pos, style = "") => {
    var li = document.createElement("li");
    var msgElement = document.createElement("div");
    msgElement.innerHTML = msg;
    msgElement.style.textAlign = pos;
    if (style) msgElement.style.fontStyle = style;
    li.appendChild(msgElement);
    ul.appendChild(li);
};

var name = prompt('Enter your name-');
// var content = editor.getContent();
socket.emit('new-user-joined', name);

form.addEventListener('submit', function (e) {
    e.preventDefault();
    var editor = tinymce.get('input');
    var content = editor.getContent();
    if (content) {
        socket.emit('chat message', content);
        var li = document.createElement("li");
        append(`You : ${content}`, 'right');
        editor.setContent("");
    }
    else console.log("no content found but input value ->" + input.value);
});
socket.on('user-joined', (name) => {
    append(`${name} joined the chat`, 'center', 'italic');
});
socket.on('user-left', (name) => {
    append(`${name} left the chat`, 'center', 'italic');
});

socket.on('receive', (data) => {
    append(`${data.name}: ${data.message} `, 'start');
});