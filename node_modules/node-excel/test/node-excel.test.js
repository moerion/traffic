var nodeExcel = require('../lib/NodeExcel');

describe('Node Excel', function() {

	describe('#create()', function() {
		it('creates a new NodeExcel object', function() {
			var excel = nodeExcel.create();
			excel.should.be.a('object');
		});
	});

	describe('#disconnectWorksheets()', function() {
		it('should disconnect all worksheets and set worksheets to a blank array', function() {
			var excel = nodeExcel.create();
			// Need to add a sheet before we can successfully test disconnection
			excel.disconnectWorksheets();
			excel.getAllSheets().length.should.equal(0);
		});
	});

	describe('#getAllSheets()', function() {
		it('returns all worksheets as an array');
	});

	describe('#getSheetCount()', function() {
		it('return the number of worksheets in the current workbook');
	});	

	describe('#getSheet()', function() {
		it('return the sheet at the specified index');
		it('throw an error if specified index does not exist');
	});

	describe('#getActiveSheet()', function() {
		it('return the currently active worksheet');
	});

	describe('#setActiveSheetIndex()', function() {
		it('sets the currently active sheet to the given index and returns new active sheet');
	});

	describe('#setActiveSheetIndexByName()', function() {
		it('sets the currently active sheet by sheet name and returns new active sheet');
	});

	describe('#getSheetByName()', function() {
		it('return a worksheet object with a valid name');
		it('return null for a non existent name');
	});

	describe('#createSheet()', function() {
		it('returns a new sheet object');
	});

	describe('#addSheet()', function() {
		it('adds a new sheet object at the specified index');
	});

	describe('#removeSheetByIndex()', function() {
		it('removes the sheet at the given index');
		it('throw an error if specified index does not exist');
	});

	describe('#getIndex()', function() {
		it('returns the index for a given sheet');
	});

	describe('#setIndexByName()', function() {
		it('set index for sheet by sheet name and return newIndex');
	});

	describe('#getSheetNames()', function() {
		it('return an array of sheet names');
	});


	describe('#addExternalSheet()', function() {
		it('return newly added sheet if a sheet does not already exist with the same name');
		it('throws an error when the new sheet has the same name as an exisiting sheet');
	});

	describe('#addNamedRange()', function() {
		it('return true after adding a new named range');
	});

	describe('#getNamedRange()', function() {
		it('return specified named range');
	});

	describe('#removedNamedRange()', function() {
		it('return node-excel object after removing specified named range');
	});

	describe('#getCellXfByIndex()', function() {
		it('return cellXf at specified index');
	});

	describe('#getCellXfByHashCode()', function() {
		it('return cellXf which has the specifed hashcode');
		it('return false if no cellXf found with specifed hashcode');
	});

	describe('#getDefaultStyle()', function() {
		it('return default style if set');
		it('throw error if no default style set');
	});

	describe('#addCellXf()', function() {
		it('add new cellXf and update cellXf index');
	});

	describe('#removeCellXfByIndex()', function() {
		it('removes the cellXf at the specified index and updates all cellXf indexes');
		it('throw error if specified index does not exist');
	});	

	describe('#getCellStyleXfByIndex()', function() {
		it('return cellStyleXf at specified index');
	});


	describe('#getCellStyleXfByHashCode()', function() {
		it('return cellStyleXf which has the specifed hashcode');
		it('return false if no cellStyleXf found with specifed hashcode');
	});

	describe('#removeCellStyleXfByIndex()', function() {
		it('removes the cellStyleXf at the specified index');
		it('throw error if specified index does not exist');
	});

	describe('#garbageCollect()', function() {
		it('removes all unneeded cellXf and updates the index for all cells and columns in the workbook');
	});

});