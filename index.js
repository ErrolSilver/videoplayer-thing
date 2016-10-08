var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var messages = [];

var messageHistory = [];
var users = [];
var previousColors = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    addUser(socket.id);

    socket.on('populate old messages', function() {
      var populationData = {
        userId: socket.id,
        messages: messageHistory
      }

      io.sockets.emit('populate message success', populationData);
    });

    socket.on('chat message', function(msg){
      msg.color = getUserColor(msg.userId);
      persistMessages(msg.text);
      addToMessageHistory(msg)
      io.emit('chat message', msg);
    });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function randomHex() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

function persistMessages(msg) {
  messages.push(msg);
  return messages;
}

function getUserColor(id) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i].color;
    }
  }
}

function addUser(id) {
  var user = {};
  var hex = randomHex();
  
  while (!previousColors.indexOf(randomHex)) {
    var hex = randomHex();
  }

  user.id = id;
  user.color = hex;

  previousColors.push(user.color);
  users.push(user);
}

function addToMessageHistory(msg) {
 var message = {};
 message.text = msg.text;
 message.user = msg.userId;
 message.color = getUserColor(msg.userId);

 messageHistory.push(message);
}