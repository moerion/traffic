var
	worksheet = require('./Worksheet'),
	documentProperties = require('./DocumentProperties'),
	documentSecurity = require('./DocumentSecurity'),
	excelStyle = require('./Style');

module.exports.create = function () {
	var
		self = {},
		properties = documentProperties.create(),
		security = documentSecurity.create(),
		worksheetCollection = [],
		activeSheetIndex = 0,
		namedRanges = {},
		cellXfSupervisor = excelStyle.create(),
		cellXfCollection = [],
		cellStyleXfCollection = [];

	function disconnectWorksheets() {
		worksheetCollection.forEach(function(worksheet) {
			worksheet.disconnectCells();
		});
		worksheetCollection = [];
	}

	function getProperties() {
		return properties;
	}

	function setProperties(newProperties) {
		properties = newProperties;
	}

	function getSecurity() {
		return security;
	}

	function setSecurity(newSecurity) {
		security = newSecurity;
	}

	function getAllSheets() {
		return worksheetCollection;
	}

	function getSheetCount() {
		return worksheetCollection.length;
	}

	function getActiveSheet() {
		return worksheetCollection[activeSheetIndex];
	}

	function setActiveSheetIndex(index) {
		if (index > worksheetCollection.length - 1) {
			throw new Error('Sheet index is out of bounds');
		} else {
			activeSheetIndex = index;
		}
		return getActiveSheet();
	}

	function getSheet(index) {
		if (index > worksheetCollection.length - 1) {
			throw new Error('Sheet index is out of bounds');
		} else {
			return worksheetCollection[index];
		}
	}

	function getSheetByName(name) {
		if (name === undefined) {
			name = '';
		}

		var sheetCount = getSheetCount();
		for (var i = 0; i < sheetCount; i++) {
			if (worksheetCollection[i].getTitle() === name) {
				return worksheetCollection[i];
			}
		}

		return null;
	}

	function setActiveSheetIndexByName(name) {
		var worksheet = getSheetByName(name);
		if (worksheet) {
			setActiveSheetIndex(worksheet.getParent().getIndex(worksheet));
			return worksheet;
		}

		throw new Error('Workbook does not contain sheet:' + name);
	}

	function addSheet(sheet, sheetIndex) {
		if (sheetIndex) {
			worksheetCollection.splice(sheetIndex, 0, sheet);
			if (activeSheetIndex >= sheetIndex) {
				activeSheetIndex++;
			}
		} else {
			worksheetCollection.push(sheet);
		}
		return sheet;
	}

	function createSheet(sheetIndex) {
		var newSheet = worksheet.create(self);
		addSheet(newSheet, sheetIndex);
		return newSheet;
	}

	function removeSheetByIndex(index) {
		if (index > worksheetCollection.length - 1) {
			throw new Error('Sheet index is out of bounds');
		} else {
			worksheetCollection.splice(index, 1);
		}
	}

	function getIndex(sheet) {
		for (var i in worksheetCollection) {
			if (worksheetCollection[i].getHashCode() === sheet.getHashCode()) {
				return i;
			}
		}
	}

	function setIndexByName(sheetName, newIndex) {
		var
			oldIndex = getIndex(getSheetByName(sheetName)),
			sheet = worksheetCollection.splice(oldIndex, 1);

		worksheetCollection.splice(newIndex, 0, sheet);
		return newIndex;
	}

	function getSheetNames() {
		var
			sheetNames = [],
			worksheetCount = getSheetCount();

		for (var i = 0; i < worksheetCount; i++) {
			sheetNames.push(getSheet(i).getTitle());
		}
		return sheetNames;
	}

	function addCellXf(style) {
		cellXfCollection.push(style);
		style.setIndex(cellXfCollection.length - 1);
	}

	function addExternalSheet(newSheet, sheetIndex) {
		if(!getSheetByName(newSheet.getTitle())) {
			throw new Error('Workbook already contains a worksheet named' + newSheet.getTitle() + '. Rename the external sheet first.');
		}

		// count how many cellXfs there are in this workbook currently, we will need this below
		var countCellXfs = cellXfCollection.length;

		// copy all the shared cellXfs from the external workbook and append them to the current
		newSheet.getParent().getCellXfCollection().forEach(function(cellXf) {
			// TODO: cloning may need to be changed to use underscore
			addCellXf(cellXf.clone());
		});

		// move sheet to this workbook
		newSheet.rebindParent(self);

		// update the cellXfs
		newSheet.getCellCollection(false).forEach(function(cellId) {
			var cell = newSheet.getCell(cellId);
			cell.setXfIndex(cell.getXfIndex() + countCellXfs);
		});

		return addSheet(newSheet, sheetIndex);
	}

	function getNamedRanges() {
		return namedRanges;
	}

	function addNamedRange(newNamedRange) {
		if (!newNamedRange.getScope()) {
			namedRanges[newNamedRange.getName()] = newNamedRange;
		} else {
			namedRanges[newNamedRange.getScope().getTitle() + '!' + newNamedRange.getName()] = newNamedRange;
		}
		return true;
	}

	function getNamedRange(namedRange, sheet) {
		var returnValue = null;

		if (namedRange !== '' && namedRange) {
			// first look for global defined name
			if (namedRanges[namedRange]) {
				returnValue = namedRanges[namedRange];
			}

			// then look for local defined name (has priority over global defined name if both names exist)
			if (namedRange && namedRanges[sheet.getTitle() + '!' + namedRange]) {
				returnValue = namedRanges[sheet.getTitle() + '!' + namedRange];
			}
		}
		return returnValue;
	}

	function removeNamedRange(namedRange, sheet) {
		if (!sheet) {
			if(namedRanges[namedRange]) {
				delete namedRanges[namedRange];
			}
		} else {
			if (namedRanges[sheet.getTitle() + '!' + namedRange]) {
				delete namedRanges[sheet.getTitle() + '!' + namedRange];
			}
		}
		return self;
	}

	function copy() {
		// NEEDS TO BE IMPLEMENTED
	}

	function clone() {
		// NEEDS TO BE IMPLEMENTED
	}

	function getCellXfCollection() {
		return cellXfCollection;
	}

	function getCellXfByIndex(index) {
		return cellXfCollection[index];
	}

	function getCellXfByHashCode(value) {
		cellXfCollection.forEach(function(cellXf) {
			if (cellXf.getHashCode() === value) {
				return cellXf;
			}
		});
		return false;
	}

	function getDefaultStyle() {
		if (cellXfCollection[0]) {
			return cellXfCollection[0];
		}
		throw new Error('No default style found for this workbook');
	}

	function removeCellXfByIndex(index) {
		if (index > cellXfCollection.length - 1) {
			throw new Error('CellXf index is out of bounds.');
		} else {
			// first remove the cellXf
			cellXfCollection.splice(index, 1);
			// then update cellXf indexes for cells
			worksheetCollection.forEach(function(worksheet) {
				worksheet.getCellCollection(false).forEach(function(cellId) {
					var cell = worksheet.getCell(cellId);
					var xfIndex = cell.getXfIndex();
					if (xfIndex > index) {
						// decrease xf index by 1
						cell.setXfIndex(xfIndex - 1);
					} else if (xfIndex === index) {
						// set to default xf index 0
						cell.setXfIndex(0);
					}
				});
			});
		}
	}

	function getCellXfSupervisor() {
		return cellXfSupervisor;
	}

	function getCellStyleXfCollection() {
		return cellStyleXfCollection;
	}

	function getCellStyleXfByIndex(index) {
		return cellStyleXfCollection[index];
	}

	function getCellStyleXfByHashCode(value) {
		cellStyleXfCollection.forEach(function(cellStyleXf) {
			if (cellStyleXf.getHashCode() === value) {
				return cellStyleXf;
			}
		});
		return false;
	}

	function removeCellStyleXfByIndex(index) {
		if (index > cellXfCollection.length - 1) {
			throw new Error('CellStyleXf index is out of bounds.');
		} else {
			cellStyleXfCollection.splice(index, 1);
		}
	}

	/**
	 * Remove all unneeded cellXf and afterwards update the xfIndex for all cells and columns in the workbook
	 */
	function garbageCollect() {
		// how many references are there to each cellXf
		var countReferencesCellXf = [];
		for(var index in cellXfCollection) {
			countReferencesCellXf[index] = 0;
		}

		worksheetCollection.forEach(function(sheet) {
			// from cells
			sheet.getCellCollection(false).forEach(function(cellId) {
				var cell = sheet.getCell(cellId);
				countReferencesCellXf[cell.getXfIndex()]++;
			});

			// from row dimensions
			sheet.getRowDimensions().forEach(function(rowDimension) {
				if (rowDimension.getXfIndex()) {
					countReferencesCellXf[rowDimension.getXfIndex()]++;
				}
			});

			// from column dimensions
			sheet.getColumnDimensions().forEach(function(columnDimension) {
				countReferencesCellXf[columnDimension.getXfIndex()]++;
			});
		});

		// remove cellXfs without references and create mapping so we can update xfIndex for all cells and columns
		var countNeededCellXfs = 0;
		var map = [];
		for(index in cellXfCollection) {
			if (countReferencesCellXf[index] > 0 || index === 0) {
				countNeededCellXfs++;
			} else {
				cellXfCollection.splice(index, 1);
			}
			map[index] = countNeededCellXfs - 1;
		}

		for(index in cellXfCollection) {
			cellXfCollection[index].setIndex(index);
		}

		if (cellXfCollection.length === 0) {
			cellXfCollection.push(excelStyle.create());
		}

		// update the xfIndex for all cells, row dimensions, column dimensions
		worksheetCollection.forEach(function(sheet) {
			// from cells
			sheet.getCellCollection(false).forEach(function(cellId) {
				var cell = sheet.getCell(cellId);
				cell.setXfIndex(map[cell.getXfIndex]);
			});

			// from row dimensions
			sheet.getRowDimensions().forEach(function(rowDimension) {
				if (rowDimension.getXfIndex()) {
					rowDimension.setXfIndex(map[rowDimension.getXfIndex()]);
				}
			});

			// from column dimensions
			sheet.getColumnDimensions().forEach(function(columnDimension) {
				columnDimension.setXfIndex(map[columnDimension.getXfIndex()]);
			});
		});

		// also do garbage collection for all the sheets
		worksheetCollection.forEach(function(sheet) {
			sheet.garbageCollect();
		});
	}

	self.disconnectWorksheets = disconnectWorksheets;
	self.getProperties = getProperties;
	self.setProperties = setProperties;
	self.getSecurity = getSecurity;
	self.setSecurity = setSecurity;
	self.getAllSheets = getAllSheets;
	self.getSheetByName = getSheetByName;
	self.getSheetCount = getSheetCount;
	self.addSheet = addSheet;
	self.getSheet = getSheet;
	self.createSheet = createSheet;
	self.getActiveSheet = getActiveSheet;
	self.getIndex = getIndex;
	self.setIndexByName = setIndexByName;
	self.setActiveSheetIndex = setActiveSheetIndex;
	self.setActiveSheetIndexByName = setActiveSheetIndexByName;
	self.getSheetNames = getSheetNames;
	self.addExternalSheet = addExternalSheet;
	self.addNamedRange = addNamedRange;
	self.getNamedRange = getNamedRange;
	self.removeNamedRange = removeNamedRange;
	self.getCellXfCollection = getCellXfCollection;
	self.getCellXfByIndex = getCellXfByIndex;
	self.getCellXfByHashCode = getCellXfByHashCode;
	self.getDefaultStyle = getDefaultStyle;
	self.addCellXf = addCellXf;
	self.removeCellXfByIndex = removeCellXfByIndex;
	self.getCellXfSupervisor = getCellXfSupervisor;
	self.getCellStyleXfCollection = getCellStyleXfCollection;
	self.getCellStyleXfByIndex = getCellStyleXfByIndex;
	self.getCellStyleXfByHashCode = getCellStyleXfByHashCode;
	self.removeCellStyleXfByIndex = removeCellStyleXfByIndex;
	self.garbageCollect = garbageCollect;

	worksheetCollection.push(worksheet.create(self));

	return self;
}