module.exports.create = function () {
	var
		self = {};

	function getInstance() {
		return self;
	}

	function updateNamedFormulas(excel, oldName, newName) {

	}

	self.getInstance = getInstance;
	self.updateNamedFormulas = updateNamedFormulas;
	return self;
}