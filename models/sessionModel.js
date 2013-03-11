(function() {
	var SessionSchema, mongoose;
	mongoose = require('../node_modules/mongoose');
	SessionSchema = new mongoose.Schema({
		key: {
			type: String
		},
		date: {
			type: String
		},
		user: {
			type: String
		}
	});
	exports.Session = mongoose.model('Session', SessionSchema, 'session');
}).call(this);
