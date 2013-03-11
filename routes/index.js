
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'ADUS DATA', group: 'index',page: 'Home', status: false })
};

exports.queries = function(req, res){
	//console.log(req.params.id);
	if (req.params.id == "TurningMovement"){
	
		var TurnMovement = require('../models/turnMovementModel').TurnMovement;
		var intersections, times, agencies;

		TurnMovement.collection.distinct("intersection", function(error, results){
		intersections = results;		
		console.log(intersections);

		TurnMovement.collection.distinct("endTime", function(error, results){
		times = results;		
		console.log(times);
		
		TurnMovement.collection.distinct("agency", function(error, results){
		agencies = results;		
		console.log(agencies);

		res.render('index', { title: 'ADUS DATA', group: 'queries', page: 'TurningMovement', status: true, isections: intersections, times: times, agencies: agencies });

		});

		});

		

		});

		

		

	}
  
};
