module.exports.create = function () {
	var
		self = {},

		constants = {
			type: {
				string2: 'str',
				string: 's',
				formula: 'f',
				numeric: 'n',
				bool: 'b',
				_null: 'null',
				inline: 'inlineStr',
				error: 'e'
			}
		},

		//Key has been reversed because of lack of associative arrays.
		//PHP Array: array('#NULL!' => 0, '#DIV/0!' => 1, '#VALUE!' => 2, '#REF!' => 3, '#NAME?' => 4, '#NUM!' => 5, '#N/A' => 6);
		errorCodes = [
			'#NULL!', //0
			'#DIV/0!', //1
			'#VALUE!', //2
			'#REF!', //3
			'#NAME?', //4
			'#NUM!', //5
			'#N/A' //6
		];

	function getErrorCodes() {
		return errorCodes;
	}

	function dataTypeForValue(tobeimplemented) {
		console.log('DataType function: dataTypeForValue incomplete');
	}

	function checkString(tobeimplemented) {
		console.log('DataType function: checkString incomplete');
	}

	function checkErrorCode(tobeimplemented) {
		console.log('DataType function: checkErrorCode incomplete');
	}

	self.getErrorCodes = getErrorCodes;
	self.dataTypeForValue = dataTypeForValue;
	self.checkString = checkString;
	self.checkErrorCode = checkErrorCode;

	return self;
}