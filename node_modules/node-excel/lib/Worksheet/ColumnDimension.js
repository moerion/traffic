module.exports.create = function (index) {
	var
		self = {},

		columnIndex = index,
		width = -1,
		autoSize = false,
		visible = true,
		outlineLevel = 0,
		collapsed = false,
		xfIndex = 0;

	function getColumnIndex() {
		return columnIndex;
	}

	function setColumnIndex(value) {
		columnIndex = value;
		return self;
	}

	function getWidth() {
		return width;
	}

	function setWidth(value) {
		if (value === undefined) {
			value = -1;
		}
		width = value;
		return self;
	}

	function getAutoSize() {
		return autoSize;
	}

	function setAutoSize(value) {
		if (value === undefined) {
			value = false;
		}

		autoSize = value;
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

	self.getColumnIndex = getColumnIndex;
	self.setColumnIndex = setColumnIndex;
	self.getWidth = getWidth;
	self.setWidth = setWidth;
	self.getAutoSize = getAutoSize;
	self.setAutoSize = setAutoSize;
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