var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ChatSchema = new Schema({
	message: String,
	user: String
});
mongoose.model('Chat', ChatSchema);