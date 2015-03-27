mongoose = require('mongoose');

module.exports = function() {
	var db = mongoose.connect('mongodb://localhost/chat');
	require('../app/models/user.server.model');
	return db;
};