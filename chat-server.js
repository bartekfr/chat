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

websocket.sockets.on('connection', function (socket) {
	socket.on('clientMessage', function(content) {
		socket.emit('serverMessage', 'You said: ' + content);
		socket.broadcast.emit('serverMessage', socket.id + ' said: ' + content);
	});

	socket.on('login', function(username) {
		socket.username = username;
		socket.emit('serverMessage', 'Currently logged in as ' + username);
		socket.broadcast.emit('serverMessage', 'User ' + username + ' logged in');
	});
	socket.emit('login');
});