// http://nodejs.org/api.html#_child_processes


module.exports = {
	auth: function(req, res, fn) {
		
		var loggedIn = false;

		var mongoose = require('mongoose');

		var user;

		var dsn = "mongodb://localhost/test";
		mongoose.connect(dsn);	

		var Cookies = require('cookies');

		var cookies = new Cookies(req,res);

		var Session = require('../models/sessionModel').Session;

		Session.findOne({ key: cookies.get('session') }, function(err, sesh) {
			if (!err) {

				if (sesh){
					user = sesh.user;
					console.log('logged in as: ' + user + ', '+ sesh.key);
					loggedIn = true;
				}
				fn({user:user, status:loggedIn});
			}
		});
	}
};
