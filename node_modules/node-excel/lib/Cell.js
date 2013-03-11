var
	cellDataTypes = require('./Cell/DataType').create();

module.exports.create = function (dataColumn, dataRow, dataValue, dataType, worksheet) {
	var
		self = {},

		valueBinder = null,
		column,
		row,
		value,
		calculatedValue = null,
		type,
		parent,
		xfIndex = 0,
		formulaAttributes;

	function notifyCacheController() {

	}

	function detach() {
		parent = null;
	}

	function attach(newParent) {
		parent = newParent;
	}

	function getColumn() {
		return column;
	}

	function getRow() {
		return row;
	}

	function getCoordinate() {
		return getColumn() + getRow();
	}

	function getValue() {
		return value;
	}

	function getFormattedValue() {
		console.log('Cell function: getFormattedValue incomplete');
	}

	function setValue() {
		console.log('Cell function: setValue incomplete');
	}

	function setValueExplicit() {
		console.log('Cell function: setValueExplicit incomplete');
	}

	function getCalculatedValue() {
		console.log('Cell function: getCalculatedValue incomplete');
	}

	function setCalculatedValue() {
		console.log('Cell function: setCalculatedValue incomplete');
	}

	function getOldCalculatedValue() {
		console.log('Cell function: getOldCalculatedValue incomplete');
	}

	function getDataType() {
		console.log('Cell function: getDataType incomplete');
	}

	function setDataType() {
		console.log('Cell function: setDataType incomplete');
	}

	function hasDataValidation() {
		console.log('Cell function: hasDataValidation incomplete');
	}

	function getDataValidation() {
		console.log('Cell function: getDataValidation incomplete');
	}

	function setDataValidation() {
		console.log('Cell function: setDataValidation incomplete');
	}

	function hasHyperlink() {
		console.log('Cell function: hasHyperlink incomplete');
	}

	function getHyperlink() {
		console.log('Cell function: getHyperlink incomplete');
	}

	function setHyperlink() {
		console.log('Cell function: setHyperlink incomplete');
	}

	function getParent() {
		console.log('Cell function: getParent incomplete');
	}

	function rebindParent() {
		console.log('Cell function: rebindParent incomplete');
	}

	function isInRange() {
		console.log('Cell function: isInRange incomplete');
	}

	function coordinateFromString() {
		console.log('Cell function: coordinateFromString incomplete');
	}

	function absoluteReference() {
		console.log('Cell function: absoluteReference incomplete');
	}

	function absoluteCoordinate() {
		console.log('Cell function: absoluteCoordinate incomplete');
	}

	function splitRange() {
		console.log('Cell function: splitRange incomplete');
	}

	function buildRange() {
		console.log('Cell function: buildRange incomplete');
	}

	function rangeBoundaries() {
		console.log('Cell function: rangeBoundaries incomplete');
	}

	function rangeDimension() {
		console.log('Cell function: rangeDimension incomplete');
	}

	function columnIndexFromString() {
		console.log('Cell function: columnIndexFromString incomplete');
	}

	function stringFromColumnIndex() {
		console.log('Cell function: stringFromColumnIndex incomplete');
	}

	function extractAllCellReferencesInRange() {
		console.log('Cell function: extractAllCellReferencesInRange incomplete');
	}

	function compareCells() {
		console.log('Cell function: compareCells incomplete');
	}

	function getValueBinder() {
		console.log('Cell function: getValueBinder incomplete');
	}

	function setValueBinder() {
		console.log('Cell function: setValueBinder incomplete');
	}

	function __clone() {
		console.log('Cell function: __clone incomplete');
	}

	function getXfIndex() {
		console.log('Cell function: getXfIndex incomplete');
	}

	function setXfIndex() {
		console.log('Cell function: setXfIndex incomplete');
	}

	function setFormulaAttributes() {
		console.log('Cell function: setFormulaAttributes incomplete');
	}

	function getFormulaAttributes() {
		console.log('Cell function: getFormulaAttributes incomplete');
	}

	function init() {
		if (column === undefined) {
			dataColumn = 'A';
		}

		if (dataRow === undefined) {
			dataRow = 1;
		}

		if (dataValue === undefined) {
			dataValue = null;
		}

		if (dataType === undefined) {
			dataType = null;
		}

		column = dataColumn.toUpper();
		row = dataRow;
		value = dataValue;
		parent = worksheet;

		if (dataType !== null) {
			if (dataType === cellDataTypes.constants.type.string2) {
				dataType = cellDataTypes.contants.type.string;
			}
			type = dataType;
		} else {
			throw new Error('Value could not be bound to cell.');
			//To Be completed.
		}
	}

	self.notifyCacheController =notifyCacheController;
	self.attach = attach;
	self.detach = detach;
	self.getColumn = getColumn;
	self.getRow = getRow;
	self.getValue = getValue;
	self.getCoordinate = getCoordinate;
	self.getFormattedValue = getFormattedValue;
	self.setValue = setValue;
	self.setValueExplicit = setValueExplicit;
	self.getCalculatedValue = getCalculatedValue;
	self.setCalculatedValue = setCalculatedValue;
	self.getOldCalculatedValue = getOldCalculatedValue;
	self.getDataType = getDataType;
	self.setDataType = setDataType;
	self.hasDataValidation = hasDataValidation;
	self.getDataValidation = getDataValidation;
	self.setDataValidation = setDataValidation;
	self.hasHyperlink = hasHyperlink;
	self.getHyperlink = getHyperlink;
	self.setHyperlink = setHyperlink;
	self.getParent = getParent;
	self.rebindParent = rebindParent;
	self.isInRange = isInRange;
	self.coordinateFromString = coordinateFromString;
	self.absoluteReference = absoluteReference;
	self.absoluteCoordinate = absoluteCoordinate;
	self.splitRange = splitRange;
	self.buildRange = buildRange;
	self.rangeBoundaries = rangeBoundaries;
	self.rangeDimension = rangeDimension;
	self.columnIndexFromString = columnIndexFromString;
	self.stringFromColumnIndex = stringFromColumnIndex;
	self.extractAllCellReferencesInRange = extractAllCellReferencesInRange;
	self.compareCells = compareCells;
	self.getValueBinder = getValueBinder;
	self.setValueBinder = setValueBinder;
	self.__clone = __clone;
	self.getXfIndex = getXfIndex;
	self.setXfIndex = setXfIndex;
	self.setFormulaAttributes = setFormulaAttributes;
	self.getFormulaAttributes = getFormulaAttributes;
	init();

	return self;
}