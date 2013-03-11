module.exports.create = function () {
	var
		self = {},
		left = 0.7,
		right = 0.7,
		top = 0.75,
		bottom = 0.75,
		header = 0.3,
		footer = 0.3;

	function getLeft() {
		return left;
	}

	function setLeft(value) {
		left = value;
		return self;
	}

	function getRight() {
		return right;
	}

	function setRight(value) {
		right = value;
		return self;
	}

	function getTop() {
		return top;
	}

	function setTop(value) {
		top = value;
		return self;
	}

	function getBottom() {
		return bottom;
	}

	function setBottom(value) {
		bottom = value;
		return self;
	}

	function getHeader() {
		return header;
	}

	function setHeader(value) {
		header = value;
		return self;
	}

	function getFooter() {
		return footer;
	}

	function setFooter(value) {
		footer = value;
		return self;
	}

	self.getLeft = getLeft;
	self.setLeft = setLeft;
	self.getRight = getRight;
	self.setRight = setRight;
	self.getTop = getTop;
	self.setTop = setTop;
	self.getBottom = getBottom;
	self.setBottom = setBottom;
	self.getHeader = getHeader;
	self.setHeader = setHeader;
	self.getFooter = getFooter;
	self.setFooter = setFooter;

	return self;
}