var socket = io();
var chatForm = document.getElementById('sendChatMessage');
var chatMessages = document.getElementById('chatMessages');
var chatInput = document.getElementById('chatInput');

chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var message = {
        text: chatInput.value,
        userId: socket.id
    }

    socket.emit('chat message', message);

    chatInput.value = '';

}, false);

socket.on('chat message', function(msg){
    populateMessage(msg);
});

socket.on('populate message success', function(data) {
    if (socket.id === data.userId) {
        for (var i = 0; i < data.messages.length; i++) {
            populateMessage(data.messages[i]);
        }
    }
});

document.addEventListener("DOMContentLoaded", function(event) {
    socket.emit('populate old messages');
});

function populateMessage(msg) {
    var messageElement = document.createElement('li');
    var messageContent = document.createTextNode(msg.text);

    messageElement.style.borderBottom = '1px solid' + msg.color;
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
}