// http://nodejs.org/api.html#_child_processes


module.exports = {
	parser: function(file, agency) {
		console.log(agency);
		var csv = require('../node_modules/csv');
			
		var intersection;
		var streets= [];

		var TurnMovement, mongoose, populateTurnMovements;
		mongoose = require('mongoose');
		TurnMovement= require('../models/turnMovementModel').TurnMovement;

		dsn = "mongodb://localhost/test";
		mongoose.connect(dsn);	

		populateTurnMovements = function(data){
			var LVTM, LVData;

			var hours = Math.floor(data.endTime * 24);
			var mins = (data.endTime * 24 - hours) * 60 / 100.0;

			LVData = {
				agency: agency,
				intersection: intersection,
				endTime: hours+mins,
				south: {
					street: streets[0],
					left: data.southLeft,
					through: data.southThrough,
					right: data.southRight,
					peds: data.southPeds },
				west: {
					street: streets[1],
					left: data.westLeft,
					through: data.westThrough,
					right: data.westRight,
					peds: data.westPeds },
				north: {
					street: streets[0],
					left: data.northLeft,
					through: data.northThrough,
					right: data.northRight,
					peds: data.northPeds },
				east: {
					street: streets[1],
					left: data.eastLeft,
					through: data.eastThrough,
					right: data.eastRight,
					peds: data.eastPeds }
				
			};
			LVTM = new TurnMovement(LVData);
			return LVTM.save(function(err, item) {
				if (err) {
					return console.log(err);
				} else {
					return console.log(item);
					console.log('Population complete!');
				}
			});
		};

		csv()
		.fromPath(file+'-Sheet2.csv', {
			columns: ['endTime','southLeft','southThrough','southRight','southPeds','westLeft','westThrough','westRight','westPeds','northLeft','northThrough','northRight','northPeds','eastLeft','eastThrough','eastRight','eastPeds']
})
	
		
		.transform(function(data){
			//data.unshift(data.pop());
			return data;
		    })

		.on('data',function(data,index){			
			if (index < 47){	
				if (index == 0){
					var n=data.southLeft.split("--");
					var m=data.westLeft.split("--");
					intersection = n[0] + ' & ' + m[0];
					streets = [n[0], m[0]];
				}
				else if (index > 1){
					populateTurnMovements(data);	
								
				}
			//console.log('#'+index+' '+intersection);
		
			}
		    })
		;


	
	
	}
};
