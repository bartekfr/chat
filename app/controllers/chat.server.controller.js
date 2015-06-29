module.exports =  function(io, socket, usersData) {
	var Chat = require('mongoose').model('Chat');

	socket.on('clientMessage', function(content) {
		socket.emit('dialogUpdate', {
			msg: 'You said: ' + content,
			current: true
		});
		socket.broadcast.emit('dialogUpdate', {
			msg: socket.username + ' said: ' + content
		});

		var chat = new Chat({
			user: socket.username,
			message: content
		});
		chat.save(function(err) {
			if (err) {
				return next(err);
			}
		});
	});

	socket.on('login', function(data) {
		var username = data.username;
		var reconnect = data.reconnect;
		socket.username = username;
		usersData.users[username] = true;
		usersData.usersCount++;
		socket.emit('serverMessage', {
			msg: 'Logged in as ' + socket.username
		});
		socket.broadcast.emit('serverMessage', {
			msg: 'User ' + socket.username + ' logged in'
		});

		socket.broadcast.emit('userJoined', {
			usersCount: usersData.usersCount,
			username: username
		});

		socket.emit('logged', {
			usersCount: usersData.usersCount
		});
		if (reconnect) {
			return true;
		}
		//load messages history
		Chat.find({}).sort({"_id": -1}).limit(10).exec(function(err, chats) {
			if (err) {
				return next(err);
			} else {
				chats.forEach(function(chat, i) {
					var user = chat.user;
					var current = false;
					if(user === username) {
						user = "You";
						current = true;
					}
					socket.emit('dialogUpdate', {
						msg: user + ' said: ' + chat.message,
						history: true,
						current: current
					});
				});
			}
		})
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