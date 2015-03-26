var express = require('express');
module.exports = function() {
	var app = express();
	var server = app.listen(3000);
	var websocket = require('socket.io').listen(server);

	require('../app/routes/index.server.routes.js')(app);
	require('./socketio')(websocket);

	app.set('views', './app/views');
	app.set('view engine', 'ejs');
	app.use(express.static('./public'));

	return app;
};