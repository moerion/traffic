module.exports.create = function (index) {
	var
		self = {},

		rowIndex = index,
		rowHeight = -1,
		visible = true,
		outlineLevel = 0,
		collapsed = false,
		xfIndex = 0;

	function getRowIndex() {
		return rowIndex;
	}

	function setRowIndex(value) {
		rowIndex = value;
		return self;
	}

	function getRowHeight() {
		return rowHeight;
	}

	function setRowHeight(value) {
		if (value === undefined) {
			value = -1;
		}
		rowHeight = value;
		return self;
	}

	function getVisible() {
		return visible;
	}

	function setVisible(value) {
		if (value === undefined) {
			value = true;
		}

		visible = value;
		return self;
	}

	function getOutlineLevel() {
		return outlineLevel;
	}

	function setOutlineLevel(value) {
		if (value < 0 || value >  7) {
			throw new Error('Outline level must range between 0 and 7.');
		}

		outlineLevel = value;
		return self;
	}

	function getCollapsed() {
		return collapsed;
	}

	function setCollapsed(value) {
		if (value === undefined) {
			value = true;
		}
		collapsed = value;
		return self;
	}

	function getXfIndex() {
		return xfIndex;
	}

	function setXfIndex(value) {
		if (value === undefined) {
			value = 0;
		}

		xfIndex = value;
		return self;
	}

	self.getRowIndex = getRowIndex;
	self.setRowIndex = setRowIndex;
	self.getRowHeight = getRowHeight;
	self.setRowHeight = setRowHeight;
	self.getVisible = getVisible;
	self.setVisible = setVisible;
	self.getOutlineLevel = getOutlineLevel;
	self.setOutlineLevel = setOutlineLevel;
	self.getCollapsed = getCollapsed;
	self.setCollapsed = setCollapsed;
	self.getXfIndex = getXfIndex;
	self.setXfIndex = setXfIndex;

	return self;
}