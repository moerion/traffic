var
	MemoryModule = require('./CachedObjectStorage/Memory');
module.exports.create = function () {
	var
		self = {};

	function getInstance(worksheet) {
		return MemoryModule.create(worksheet);
	}

	self.getInstance = getInstance;
	return self;
}