// http://nodejs.org/api.html#_child_processes


module.exports = {
	convertXlsToCsv: function(file) {

		var parseTurnMovement = require('./parseTurnMovement.js');
		var sys = require('sys');
		var exec = require('child_process').exec;
		var child;

		// executes `pwd`
		child = exec("python ./controllers/inXls.py --file=\"" + file + "\"", function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		if (error !== null) {
		console.log('exec error: ' + error);
		}
		else{
			parseTurnMovement.parser(file, 'Las Vegas');
		}
		});
	}
};
