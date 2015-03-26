module.exports =  function(io, socket, usersData) {

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
		usersData.users[username] = true;
		usersData.usersCount++;
		socket.emit('serverMessage', {
			msg: 'Logged in as ' + socket.username,
			system: true
		});
		socket.broadcast.emit('serverMessage', {
			msg: 'User ' + socket.username + ' logged in',
			system: true
		});

		socket.broadcast.emit('userJoined', {
			usersCount: usersData.usersCount,
			username: username
		});

		socket.emit('logged', {
			usersCount: usersData.usersCount
		});
	});

	socket.on('disconnect', function () {
		// remove the username from global usernames list
		if(typeof socket.username !== 'undefined') {
			delete usersData.users[socket.username];
			usersData.usersCount--;
			// echo globally that this client has left
			socket.broadcast.emit('userLeft', {
				username: socket.username,
				usersCount: usersData.usersCount
			});
			socket.broadcast.emit('serverMessage', {
				msg: 'User ' + socket.username + ' left chat',
				system: true
			});
		}
	});
}