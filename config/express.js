var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

module.exports = function() {
	var app = express();
	var server = app.listen(3000);
	var websocket = require('socket.io').listen(server);

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(methodOverride());

	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);
	require('./socketio')(websocket);

	app.set('views', './app/views');
	app.set('view engine', 'ejs');
	app.use(express.static('./public'));

	return app;
};