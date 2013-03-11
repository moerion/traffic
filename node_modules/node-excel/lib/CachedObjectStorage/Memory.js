var
	_ = require("underscore");

module.exports.create = function (worksheet) {
	var
		self = {},

		parent = worksheet,
		currentObject = null,
		currentObjectId = null,
		currentCellIsDirty = true,
		cellCache = {};

	function isDataSet(coord) {
		if (coord === currentObjectId) {
			return true;
		}
		return _.has(cellCache, coord);
	}

	function addCacheData(coord, cell) {
		cellCache.coord = cell;
		return cell;
	}

	function getCacheData(coord) {
		if (!_.has(cellCache, coord)) {
			return null;
		}

		return cellCache.coord;
	}

	function updateCacheData(cell) {
		return addCacheData(cell.getCoordinate(), cell);
	}

	function deleteCacheData(coord) {
		if (coord === currentObjectId) {
			currentObject.detach();
			currentObjectId = null;
			currentObject = null;
		}

		if (typeof(cellCache.coord) === 'object') {
			cellCache.coord.detach();

			//Not sure if this is the correct way to unset the object property.
			cellCache.coord = null;
		}

		currentCellIsDirty = false;
	}

	function getCellList() {
		return _.keys(cellCache);
	}

	function getSortedCellList() {
		var sortedKeys = [];
		var cellList = getCellList();
		return _.sortBy(cellList, function(coord) {
			var numberStartPosition = coord.search(/[0-9]/);
			var col = coord.substring(0, numberStartPosition);
			var row = coord.substring(numberStartPosition);
			while (col.length < 3) {
				col = ' ' + col;
			}
			while (row.length < 9) {
				row = '0' + row;
			}
			return row + col;
		});
	}

	function getHighestRowAndColumn() {
		var sortedKeys = [];
		var cellList = getCellList();
		_.each(cellList, function(coord) {
			var numberStartPosition = coord.search(/[0-9]/);
			var col = coord.substring(0, numberStartPosition);
			var row = coord.substring(numberStartPosition);
			sortedKeys.push({row: row, col: row, coord: coord});
		});

		var maxRow = _.max(sortedKeys, function(key) {
			return key.row;
		});

		var maxCol = _.max(sortedKeys, function(key) {
			return key.col.length + key.col;
		});

		return { row: maxRow.row, col: maxCol.col};
	}

	function getHighestColumn() {
		var colRow = getHighestRowAndColumn();
		return colRow.row;
	}

	function getHighestRow() {
		var colRow = getHighestRowAndColumn();
		return colRow.col;
	}

	function getUniqueID() {
		return 'id' + (new Date()).getTime();
	}

	function copyCellCollection(worksheet) {
		parent = worksheet;
		if ((currentObject !== null) && (typeof(currentObject) === 'object')) {
			currentObject.attach(worksheet);
		}

		var newCollection = {};
		_.each(cellCache, function(cell, coord) {
			newCollection.coord = cell;
			newCollection.coord.attach(worksheet);
		});

		cellCache = newCollection;
	}

	function cacheMethodIsAvailable() {
		return true;
	}

	function unsetWorksheetCells() {
		_.each(cellCache, function(cell, coord) {
			cell.detach();
		});

		cellCache = {};
		parent = null;
	}

	self.isDataSet = isDataSet;
	self.addCacheData = addCacheData;
	self.getCacheData = getCacheData;
	self.updateCacheData = updateCacheData;
	self.deleteCacheData = deleteCacheData;
	self.getCellList = getCellList;
	self.getSortedCellList =getSortedCellList;
	self.getHighestRowAndColumn = getHighestRowAndColumn;
	self.getHighestColumn = getHighestColumn;
	self.getHighestRow = getHighestRow;
	self.copyCellCollection = copyCellCollection;
	self.cacheMethodIsAvailable = cacheMethodIsAvailable;
	self.unsetWorksheetCells = unsetWorksheetCells;

	return self;
}