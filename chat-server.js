var http = require('http');
var fs = require('fs');
var server = http.createServer(callback).listen(3000);
var websocket = require('socket.io').listen(server);

function callback(req, res) {
	fs.readFile(__dirname + '/index.html',
		function(error, data) {
			if (error) {
			 res.writeHead(500);
			 return res.end('Error loading index.html');
			}

			res.writeHead(200);
			res.end(data);
		}
	);
}

var users = {};
var usersCount = 0;

websocket.sockets.on('connection', function (socket) {
	socket.on('clientMessage', function(content) {
		socket.emit('serverMessage', 'You said: ' + content);
		socket.broadcast.emit('serverMessage', socket.username + ' said: ' + content);
	});

	socket.on('login', function(username) {
		socket.username = username;
		users[username] = true;
		usersCount++;
		socket.emit('serverMessage', 'Logged in as ' + socket.username);
		socket.broadcast.emit('serverMessage', 'User ' + socket.username + ' logged in');

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
		if(typeof socket.username !== "undefined") {
			delete users[socket.username];
			usersCount--;
			// echo globally that this client has left
			socket.broadcast.emit('userLeft', {
				username: socket.username,
				usersCount: usersCount
			});
			socket.broadcast.emit('serverMessage', 'User ' + socket.username + ' left chat');
		}

	});

});