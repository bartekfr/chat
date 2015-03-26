var path = require("path");
exports.render = function(req, res) {
//	res.sendFile(path.join(__dirname, '../../', 'index.html'));
	res.render('index', {
		title: 'Chat app'
	})
};