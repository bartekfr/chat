var express = require('./config/express');
var app = express();
var server = app.listen(3000);
var websocket = require('socket.io').listen(server);

var users = {};
var usersCount = 0;

websocket.sockets.on('connection', function (socket) {
	socket.on('clientMessage', function(content) {
		socket.emit('serverMessage', {
			msg: 'You said: ' + content
		});
		socket.broadcast.emit('serverMessage', {
			msg: socket.username + ' said: ' + content
		});
	});

	socket.on('login', function(username) {
		socket.username = username;
		users[username] = true;
		usersCount++;
		socket.emit('serverMessage', {
			msg: 'Logged in as ' + socket.username,
			system: true
		});
		socket.broadcast.emit('serverMessage', {
			msg: 'User ' + socket.username + ' logged in',
			system: true
		});

		socket.broadcast.emit('userJoined', {
			usersCount: usersCount,
			username: username
		});

		socket.emit('logged', {
			usersCount: usersCount
		});
	});

	socket.on('disconnect', function () {
		// remove the username from global usernames list
		if(typeof socket.username !== 'undefined') {
			delete users[socket.username];
			usersCount--;
			// echo globally that this client has left
			socket.broadcast.emit('userLeft', {
				username: socket.username,
				usersCount: usersCount
			});
			socket.broadcast.emit('serverMessage', {
				msg: 'User ' + socket.username + ' left chat',
				system: true
			});
		}
	});
});