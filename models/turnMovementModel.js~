(function() {
	var TurnMovementSchema, mongoose;
	mongoose = require('../node_modules/mongoose');
	TurnMovementSchema = new mongoose.Schema({
		agency: {
			type: String
		},
		intersection: {
			type: String
		},
		endTime: {
			type: Number
		},
		south: {
			street: String,
			left: Number,
			through: Number,
			right: Number,
			peds: Number
		},
		west: {
			street: String,
			left: Number,
			through: Number,
			right: Number,
			peds: Number
		},
		north: {
			street: String,
			left: Number,
			through: Number,
			right: Number,
			peds: Number
		},
		east: {
			street: String,
			left: Number,
			through: Number,
			right: Number,
			peds: Number
		}

	});
	exports.TurnMovement = mongoose.model('TurnMovement', TurnMovementSchema, 'turnMovement');
}).call(this);
