(function() {
	var UserSchema, mongoose;
	mongoose = require('../node_modules/mongoose');
	UserSchema = new mongoose.Schema({
		userName: {
			type: String
		},
		agencyName: {
			type: String
		},
		email: {
			type: String,
			lowercase: true
		},
		password: {
			type: String
		}
	});
	exports.User = mongoose.model('User', UserSchema, 'user');
	//exports.UserSchema = UserSchema;
}).call(this);
