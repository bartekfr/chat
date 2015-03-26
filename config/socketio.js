module.exports = function(io) {
	var usersData = {
			users: {},
			usersCount: 0
	};
	
	io.on('connection', function(socket) {
		require('../app/controllers/chat.server.controller')(io, socket, usersData);
	});
};