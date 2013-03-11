var
	nodeExcel = require('../lib/NodeExcel'),
	worksheet = require('../lib/Worksheet');

describe('Worksheet', function() {

	var excel;
	var newWorkSheet;

	beforeEach(function() {
		excel = nodeExcel.create();
		newWorkSheet = worksheet.create(excel);
	});

	describe('#create()', function() {

		it('returns an empty worksheet', function() {
			var excel = nodeExcel.create();
			var newWorkSheet = worksheet.create(excel);
			newWorkSheet.should.be.a('object');
		});
	});

	describe('#disconnectCells()', function() {
		it('todo');
	});

	describe('#getCellCacheController()', function() {
		it('todo');
	});

	describe('#getInvalidTitleCharacters()', function() {
		it('returns an array of invalid title characters', function() {
			var characters = newWorkSheet.getInvalidTitleCharacters();
			characters.should.be.an.instanceof(Array);
			characters.should.eql(['*', ':', '/', '\\', '?', '[', ']']);
		});
	});

	describe('#getParent()', function() {
		it('return a nodeExcel object');
	});

	describe('#getTitle()', function() {

		it('returns worksheet object with new title when a new title is set', function() {
			newWorkSheet = newWorkSheet.setTitle('my sheet');
			var title = newWorkSheet.getTitle();
			title.should.be.equal('my sheet');
		});
	});

	describe('#setTitle()', function() {

		it('returns worksheet object when same name passed in', function() {
			newWorkSheet = newWorkSheet.setTitle('sheet');
			newWorkSheet.should.be.a('object');
		});

		it('returns worksheet object with new title when a new title is set', function() {
			newWorkSheet = newWorkSheet.setTitle('my sheet');
			var title = newWorkSheet.getTitle();
			title.should.be.equal('my sheet');
		});

		it('returns a worksheet with a valid name of a sheet that already exists with a number added.');
		it('returns a worksheet with a valid name(31 characters) of a sheet that already exists truncated');

		it('throws an error when a invalid character is used for the title', function() {
			(function() {
				newWorkSheet = newWorkSheet.setTitle('my sheet *');
			}).should.throw(/^Invalid character found in sheet title/);
		});

		it('throws an error when a title of more than 31 characters is used', function() {
			(function() {
				newWorkSheet = newWorkSheet.setTitle('my sheet title is longer than 31 characters so will throw an error');
			}).should.throw('Maximum 31 characters allowed in sheet title.');
		});
	});

	describe('#sortCellCollection()', function() {
		it('todo');
	});

	describe('#getRowDimensions()', function() {
		it('todo');
	});

	describe('#getDefaultRowDimension()', function() {
		it('todo');
	});

	describe('#getColumnDimensions()', function() {
		it('todo');
	});

	describe('#getDefaultColumnDimension()', function() {
		it('todo');
	});

	describe('#getDrawingCollection()', function() {
		it('todo');
	});

	describe('#getChartCollection()', function() {
		it('todo');
	});

	describe('#addChart()', function() {
		it('todo');
	});

	describe('#getChartCount()', function() {
		it('todo');
	});

	describe('#getChartByIndex()', function() {
		it('todo');
	});

	describe('#getChartNames()', function() {
		it('todo');
	});

	describe('#getChartByName()', function() {
		it('todo');
	});

	describe('#refreshColumnDimensions()', function() {
		it('todo');
	});

	describe('#refreshRowDimensions()', function() {
		it('todo');
	});

	describe('#calculateWorksheetDimension()', function() {
		it('todo');
	});

	describe('#calculateWorksheetDataDimension()', function() {
		it('todo');
	});

	describe('#calculateColumnWidths()', function() {
		it('todo');
	});

	describe('#rebindParent()', function() {
		it('todo');
	});

	describe('#getSheetState()', function() {
		it('todo');
	});

	describe('#setSheetState()', function() {
		it('todo');
	});

	describe('#getPageSetup()', function() {
		it('todo');
	});

	describe('#setPageSetup()', function() {
		it('todo');
	});

	describe('#getPageMargins()', function() {
		it('todo');
	});

	describe('#setPageMargins()', function() {
		it('todo');
	});

	describe('#getHeaderFooter()', function() {
		it('todo');
	});

	describe('#setHeaderFooter()', function() {
		it('todo');
	});

	describe('#getSheetView()', function() {
		it('todo');
	});

	describe('#setSheetView()', function() {
		it('todo');
	});

	describe('#getProtection()', function() {
		it('todo');
	});

	describe('#setProtection()', function() {
		it('todo');
	});

	describe('#getHighestColumn()', function() {
		it('todo');
	});

	describe('#getHighestDataColumn()', function() {
		it('todo');
	});

	describe('#getHighestRow()', function() {
		it('todo');
	});

	describe('#getHighestDataRow()', function() {
		it('todo');
	});

	describe('#setCellValue()', function() {
		it('todo');
	});

	describe('#setCellValueByColumnAndRow()', function() {
		it('todo');
	});

	describe('#setCellValueExplicit()', function() {
		it('todo');
	});

	describe('#setCellValueExplicitByColumnAndRow()', function() {
		it('todo');
	});

	describe('#getCell()', function() {
		it('todo');
	});

	describe('#getCellByColumnAndRow()', function() {
		it('todo');
	});

	describe('#cellExists()', function() {
		it('todo');
	});

	describe('#cellExistsByColumnAndRow()', function() {
		it('todo');
	});

	describe('#getRowDimension()', function() {
		it('todo');
	});

	describe('#getColumnDimension()', function() {
		it('todo');
	});

	describe('#getColumnDimensionByColumn()', function() {
		it('todo');
	});

	describe('#getStyles()', function() {
		it('todo');
	});

	describe('#getDefaultStyle()', function() {
		it('todo');
	});

	describe('#setDefaultStyle()', function() {
		it('todo');
	});

	describe('#getStyle()', function() {
		it('todo');
	});

	describe('#getConditionalStyles()', function() {
		it('todo');
	});

	describe('#conditionalStylesExists()', function() {
		it('todo');
	});

	describe('#removeConditionalStyles()', function() {
		it('todo');
	});

	describe('#getConditionalStylesCollection()', function() {
		it('todo');
	});

	describe('#setConditionalStyles()', function() {
		it('todo');
	});

	describe('#getStyleByColumnAndRow()', function() {
		it('todo');
	});

	describe('#setSharedStyle()', function() {
		it('todo');
	});

	describe('#duplicateStyle()', function() {
		it('todo');
	});

	describe('#duplicateConditionalStyle()', function() {
		it('todo');
	});

	describe('#duplicateStyleArray()', function() {
		it('todo');
	});

	describe('#setBreak()', function() {
		it('todo');
	});

	describe('#setBreakByColumnAndRow()', function() {
		it('todo');
	});

	describe('#getBreaks()', function() {
		it('todo');
	});

	describe('#mergeCells()', function() {
		it('todo');
	});

	describe('#mergeCellsByColumnAndRow()', function() {
		it('todo');
	});

	describe('#unmergeCells()', function() {
		it('todo');
	});

	describe('#unmergeCellsByColumnAndRow()', function() {
		it('todo');
	});

	describe('#getMergeCells()', function() {
		it('todo');
	});

	describe('#setMergeCells()', function() {
		it('todo');
	});

	describe('#protectCells()', function() {
		it('todo');
	});

	describe('#protectCellsByColumnAndRow()', function() {
		it('todo');
	});

	describe('#unprotectCells()', function() {
		it('todo');
	});

	describe('#unprotectCellsByColumnAndRow()', function() {
		it('todo');
	});

	describe('#getProtectedCells()', function() {
		it('todo');
	});

	describe('#getAutoFilter()', function() {
		it('todo');
	});

	describe('#setAutoFilter()', function() {
		it('todo');
	});

	describe('#setAutoFilterByColumnAndRow()', function() {
		it('todo');
	});

	describe('#removeAutoFilter()', function() {
		it('todo');
	});

	describe('#getFreezePane()', function() {
		it('todo');
	});

	describe('#freezePane()', function() {
		it('todo');
	});

	describe('#freezePaneByColumnAndRow()', function() {
		it('todo');
	});

	describe('#unfreezePane()', function() {
		it('todo');
	});

	describe('#insertNewRowBefore()', function() {
		it('todo');
	});

	describe('#insertNewColumnBefore()', function() {
		it('todo');
	});

	describe('#insertNewColumnBeforeByIndex()', function() {
		it('todo');
	});

	describe('#removeRow()', function() {
		it('todo');
	});

	describe('#removeColumn()', function() {
		it('todo');
	});

	describe('#removeColumnByIndex()', function() {
		it('todo');
	});

	describe('#getShowGridlines()', function() {
		it('todo');
	});

	describe('#setShowGridlines()', function() {
		it('todo');
	});

	describe('#getPrintGridlines()', function() {
		it('todo');
	});

	describe('#setPrintGridlines()', function() {
		it('todo');
	});

	describe('#getShowRowColHeaders()', function() {
		it('todo');
	});

	describe('#setShowRowColHeaders()', function() {
		it('todo');
	});

	describe('#getShowSummaryBelow()', function() {
		it('todo');
	});

	describe('#setShowSummaryBelow()', function() {
		it('todo');
	});

	describe('#getShowSummaryRight()', function() {
		it('todo');
	});

	describe('#setShowSummaryRight()', function() {
		it('todo');
	});

	describe('#getComments()', function() {
		it('todo');
	});

	describe('#setComments()', function() {
		it('todo');
	});

	describe('#getComment()', function() {
		it('todo');
	});

	describe('#getCommentByColumnAndRow()', function() {
		it('todo');
	});

	describe('#getSelectedCell()', function() {
		it('todo');
	});

	describe('#getActiveCell()', function() {
		it('todo');
	});

	describe('#getSelectedCells()', function() {
		it('todo');
	});

	describe('#setSelectedCell()', function() {
		it('todo');
	});

	describe('#setSelectedCells()', function() {
		it('todo');
	});

	describe('#setSelectedCellByColumnAndRow()', function() {
		it('todo');
	});

	describe('#getRightToLeft()', function() {
		it('todo');
	});

	describe('#setRightToLeft()', function() {
		it('todo');
	});

	describe('#fromArray()', function() {
		it('todo');
	});

	describe('#rangeToArray()', function() {
		it('todo');
	});

	describe('#namedRangeToArray()', function() {
		it('todo');
	});

	describe('#toArray()', function() {
		it('todo');
	});

	describe('#getRowIterator()', function() {
		it('todo');
	});

	describe('#garbageCollect()', function() {
		it('todo');
	});

	describe('#getHashCode()', function() {
		it('todo');
	});

	describe('#extractSheetTitle()', function() {
		it('todo');
	});

	describe('#getHyperlink()', function() {
		it('todo');
	});

	describe('#setHyperlink()', function() {
		it('todo');
	});

	describe('#hyperlinkExists()', function() {
		it('todo');
	});

	describe('#getHyperlinkCollection()', function() {
		it('todo');
	});

	describe('#getDataValidation()', function() {
		it('todo');
	});

	describe('#setDataValidation()', function() {
		it('todo');
	});

	describe('#dataValidationExists()', function() {
		it('todo');
	});

	describe('#getDataValidationCollection()', function() {
		it('todo');
	});

	describe('#shrinkRangeToFit()', function() {
		it('todo');
	});

	describe('#getTabColor()', function() {
		it('todo');
	});

	describe('#resetTabColor()', function() {
		it('todo');
	});

	describe('#isTabColorSet()', function() {
		it('todo');
	});

	describe('#copy()', function() {
		it('todo');
	});

	describe('#__clone()', function() {
		it('todo');
	});

});