(function() {
	var User, mongoose, populateUsers;
	mongoose = require('mongoose');
	User = require('../models/userModel').User;

	dsn = "mongodb://localhost/test";
	mongoose.connect(dsn);	

	populateUsers = function(){
		var LVUser, LVData;
		LVData = {
			userName: "NorthLasVegas",
			agencyName: "City of North Las Vegas",
			email: "northlasvegas@gmail.com",
			password: "upload2"
		};
		LVUser = new User(LVData);
		return LVUser.save(function(err, item) {
			if (err) {
				return console.log(err);
			} else {
				return console.log(item);
			}
		});
	};
	populateUsers();
}).call(this);
