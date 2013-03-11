var
	_ = require("underscore");

var
	cachedObjectStorageFactory = require('./CachedObjectStorageFactory').create(),
	PageSetupModule = require('./Worksheet/PageSetup'),
	PageMarginsModule = require('./Worksheet/PageMargins'),
	HeaderFooterModule = require('./Worksheet/HeaderFooter'),
	SheetViewModule = require('./Worksheet/SheetView'),
	ProtectionModule = require('./Worksheet/Protection'),
	RowDimensionModule = require('./Worksheet/RowDimension'),
	ColumnDimensionModule = require('./Worksheet/ColumnDimension'),
	referenceHelper = require('./ReferenceHelper').create();

module.exports.create = function (excel, title) {

	var constants = {
		break: {
			none: 0,
			row: 1,
			column: 2
		},
		sheetState: {
			visible: 'visible',
			hidden: 'hidden',
			veryHidden: 'veryHidden'
		},
		invalidCharactersForTitle: {
			list: ['*', ':', '/', '\\', '?', '[', ']'],
			regExp: /[\*\:\/\\\?\[\]]/i
		}
	};

	var
		self = {},

		parent,
		cellCollection = null,
		rowDimensions = {},
		defaultRowDimension = RowDimensionModule.create(null),
		columnDimensions = {},
		defaultColumnDimension = ColumnDimensionModule.create(null),
		drawingCollection = null,
		chartCollection = null,
		workSheetTitle,
		sheetState,
		pageSetup = PageSetupModule.create(),
		pageMargins = PageMarginsModule.create(),
		headerFooter = HeaderFooterModule.create(),
		sheetView = SheetViewModule.create(),
		protection = ProtectionModule.create(),
		styles = [],
		conditionalStylesCollection = [],
		cellCollectionIsSorted = false,
		breaks = [],
		mergedCells = [],
		protectedCells = [],
		autoFilter = '',
		freezedPane = '',
		showGridLines = true,
		printGridLines = true,
		showRowColHeaders = true,
		showSummaryBelow = true,
		showSummaryRight = true,
		comments = [],
		activeCell = 'A1',
		selectedCells = 'A1',
		cachedHighestColumn = 'A',
		cachedHighestRow = 1,
		rightToLeft = false,
		hyperLinkCollection = [],
		dataValidationCollection = [],
		tabColor,
		dirty = true,
		hash = null;

	function getParent() {
		return parent;
	}

	function getTitle() {
		return workSheetTitle;
	}

	function getInvalidTitleCharacters() {
		return constants.invalidCharactersForTitle.list;
	}

	function checkSheetTitle(title) {
		if (title.search(constants.invalidCharactersForTitle.regExp) !== -1) {
			throw new Error('Invalid character found in sheet title, must not include: ' + getInvalidTitleCharacters());
		}

		if (title.length > 31) {
			throw new Error('Maximum 31 characters allowed in sheet title.');
		}

		return title;
	}

	function setTitle(title, updateFormulaCellReferences) {
		if (updateFormulaCellReferences === undefined) {
			updateFormulaCellReferences = true;
		}

		if (getTitle() === title) {
			return self;
		}

		checkSheetTitle(title);

		var oldTitle = getTitle();

		if (getParent().getSheetByName(title)) {

			if (title.length > 29) {
				title = title.substring(0, 29);
			}

			var i = 1;
			while (getParent().getSheetByName(title + ' ' + i)) {
				i++;
				if ((i === 10) && (title.length > 28)) {
					title = title.substring(0, 28);
				} else if ((i === 100) && (title.length > 27)) {
					title = title.substring(0, 27);
				}
			}

			var altTitle = title + ' ' + i;
			return setTitle(altTitle);
		}

		workSheetTitle = title;
		dirty = true;

		if (updateFormulaCellReferences) {
			referenceHelper.getInstance().updateNamedFormulas(getParent(), oldTitle, getTitle());
		}
		return self;
	}

	function disconnectCells() {
		cellCollection.unsetWorksheetCells();
		cellCollection = null;
		//	detach ourself from the workbook, so that it can then delete this worksheet successfully
		parent = null;
	}

	function getCellCacheController() {
		return cellCollection;
	}

	function sortCellCollection() {
		if (cellCollection !== null) {
			return cellCollection.getSortedCellList();
		}

		return [];
	}

	function getCellCollection(sorted) {
		if (sorted === undefined) {
			sorted = true;
		}

		if (sorted) {
			return sortCellCollection();
		}

		if (cellCollection !== null) {
			return cellCollection.getCellList();
		}

		return [];
	}

	function getRowDimensions() {
		return rowDimensions;
	}

	function getDefaultRowDimension() {
		return defaultRowDimension;
	}

	function getColumnDimensions() {
		return columnDimensions;
	}

	function getDefaultColumnDimension() {
		return defaultColumnDimension;
	}

	function getDrawingCollection() {
		return drawingCollection;
	}

	function getChartCollection() {
		return chartCollection;
	}

	function addChart(tobeimplemented) {
		console.log('Worksheet function: addChart incomplete');
	}

	function getChartCount(tobeimplemented) {
		console.log('Worksheet function: getChartCount incomplete');
	}

	function getChartByIndex(tobeimplemented) {
		console.log('Worksheet function: getChartByIndex incomplete');
	}

	function getChartNames(tobeimplemented) {
		console.log('Worksheet function: getChartNames incomplete');
	}

	function getChartByName(tobeimplemented) {
		console.log('Worksheet function: getChartByName incomplete');
	}

	function refreshColumnDimensions() {
		var currentColumnDimensions = getColumnDimensions();
		var newColumnDimensions = {};

		_.each(currentColumnDimensions, function(column) {
			newColumnDimensions[column.getColumnIndex()] = column;
		});

		columnDimensions = newColumnDimensions;
	}

	function refreshRowDimensions() {
		var currentRowDimensions = getRowDimensions();
		var newRowDimensions = {};

		_.each(currentRowDimensions, function(row) {
			newRowDimensions[row.getRowIndex()] = row;
		});

		rowDimensions = newRowDimensions;
	}

	function getHighestColumn() {
		return cachedHighestColumn;
	}

	function getHighestRow() {
		return cachedHighestRow;
	}

	function getHighestDataColumn() {
		return cellCollection.getHighestColumn();
	}

	function getHighestDataRow() {
		return cellCollection.getHighestRow();
	}

	function calculateWorksheetDimension() {
		return 'A1:' + getHighestColumn() + getHighestRow();
	}

	function calculateWorksheetDataDimension() {
		return 'A1:' + getHighestDataColumn() + getHighestDataRow();
	}

	function calculateColumnWidths(tobeimplemented) {
		console.log('Worksheet function: calculateColumnWidths incomplete');
	}

	function rebindParent(newParent) {
		var namedRanges = parent.getNamedRanges();
		_.each(namedRanges, function(range) {
			newParent.addNamedRange(range);
		});

		parent.removeSheetByIndex(parent.getIndex(self));
		parent = newParent;
	}

	function getSheetState() {
		return sheetState;
	}

	function setSheetState(state) {
		if (state === undefined) {
			state = constants.sheetState.visible;
		}

		sheetState = state;
		return self;
	}

	function getPageSetup() {
		return pageSetup;
	}

	function setPageSetup(setup) {
		pageSetup = setup;
		return self;
	}

	function getPageMargins() {
		return pageMargins;
	}

	function setPageMargins(margins) {
		pageMargins = margins;
		return self;
	}

	function getHeaderFooter() {
		return headerFooter;
	}

	function setHeaderFooter(newHeadeFooter) {
		headerFooter = newHeadeFooter;
		return self;
	}

	function getSheetView() {
		return sheetView;
	}

	function setSheetView(view) {
		sheetView = view;
		return self;
	}

	function getProtection() {
		return protection;
	}

	function setProtection(newProtection) {
		protection = newProtection;
		dirty = true;
		return self;
	}

	function setCellValue(tobeimplemented) {
		console.log('Worksheet function: setCellValue incomplete');
	}

	function setCellValueByColumnAndRow(tobeimplemented) {
		console.log('Worksheet function: setCellValueByColumnAndRow incomplete');
	}

	function setCellValueExplicit(tobeimplemented) {
		console.log('Worksheet function: setCellValueExplicit incomplete');
	}

	function setCellValueExplicitByColumnAndRow(tobeimplemented) {
		console.log('Worksheet function: setCellValueExplicitByColumnAndRow incomplete');
	}

	function getCell(tobeimplemented) {
		console.log('Worksheet function: getCell incomplete');
	}

	function getCellByColumnAndRow(tobeimplemented) {
		console.log('Worksheet function: getCellByColumnAndRow incomplete');
	}

	function cellExists(tobeimplemented) {
		console.log('Worksheet function: cellExists incomplete');
	}

	function cellExistsByColumnAndRow(tobeimplemented) {
		console.log('Worksheet function: cellExistsByColumnAndRow incomplete');
	}

	function getRowDimension(tobeimplemented) {
		console.log('Worksheet function: getRowDimension incomplete');
	}

	function getColumnDimension(tobeimplemented) {
		console.log('Worksheet function: getColumnDimension incomplete');
	}

	function getColumnDimensionByColumn(tobeimplemented) {
		console.log('Worksheet function: getColumnDimensionByColumn incomplete');
	}

	function getStyles() {
		return styles;
	}

	function getDefaultStyle(tobeimplemented) {
		return parent.getDefaultStyle();
	}

	function setDefaultStyle(style) {
		var defaultStyle = getDefaultStyle();
		defaultStyle.applyFromArray({
			'font': {
				'name': style.getFont().getName(),
				'size': style.getFont().getSize()
			}
		});
		return self;
	}

	function getStyle(tobeimplemented) {
		console.log('Worksheet function: getStyle incomplete');
	}

	function getConditionalStyles(tobeimplemented) {
		console.log('Worksheet function: getConditionalStyles incomplete');
	}

	function conditionalStylesExists(tobeimplemented) {
		console.log('Worksheet function: conditionalStylesExists incomplete');
	}

	function removeConditionalStyles(tobeimplemented) {
		console.log('Worksheet function: removeConditionalStyles incomplete');
	}

	function getConditionalStylesCollection() {
		return conditionalStylesCollection;
	}

	function setConditionalStyles(coord, value) {
		conditionalStylesCollection[coord] = value;
		return self;
	}

	function getStyleByColumnAndRow(tobeimplemented) {
		console.log('Worksheet function: getStyleByColumnAndRow incomplete');
	}

	function setSharedStyle(tobeimplemented) {
		console.log('Worksheet function: setSharedStyle incomplete');
	}

	function duplicateStyle(tobeimplemented) {
		console.log('Worksheet function: duplicateStyle incomplete');
	}

	function duplicateConditionalStyle(tobeimplemented) {
		console.log('Worksheet function: duplicateConditionalStyle incomplete');
	}

	function duplicateStyleArray(tobeimplemented) {
		console.log('Worksheet function: duplicateStyleArray incomplete');
	}

	function setBreak(tobeimplemented) {
		console.log('Worksheet function: setBreak incomplete');
	}

	function setBreakByColumnAndRow(tobeimplemented) {
		console.log('Worksheet function: setBreakByColumnAndRow incomplete');
	}

	function getBreaks() {
		return breaks;
	}

	function mergeCells(tobeimplemented) {
		console.log('Worksheet function: mergeCells incomplete');
	}

	function mergeCellsByColumnAndRow(tobeimplemented) {
		console.log('Worksheet function: mergeCellsByColumnAndRow incomplete');
	}

	function unmergeCells(tobeimplemented) {
		console.log('Worksheet function: unmergeCells incomplete');
	}

	function unmergeCellsByColumnAndRow(tobeimplemented) {
		console.log('Worksheet function: unmergeCellsByColumnAndRow incomplete');
	}

	function getMergeCells() {
		return mergedCells;
	}

	function setMergeCells(cells) {
		mergedCells = cells;
		return self;
	}

	function protectCells(tobeimplemented) {
		console.log('Worksheet function: protectCells incomplete');
	}

	function protectCellsByColumnAndRow(tobeimplemented) {
		console.log('Worksheet function: protectCellsByColumnAndRow incomplete');
	}

	function unprotectCells(tobeimplemented) {
		console.log('Worksheet function: unprotectCells incomplete');
	}

	function unprotectCellsByColumnAndRow(tobeimplemented) {
		console.log('Worksheet function: unprotectCellsByColumnAndRow incomplete');
	}

	function getProtectedCells() {
		return protectedCells;
	}

	function getAutoFilter() {
		return autoFilter;
	}

	function setAutoFilter(tobeimplemented) {
		console.log('Worksheet function: setAutoFilter incomplete');
	}

	function setAutoFilterByColumnAndRow(tobeimplemented) {
		console.log('Worksheet function: setAutoFilterByColumnAndRow incomplete');
	}

	function removeAutoFilter() {
		autoFilter = '';
		return self;
	}

	function getFreezePane() {
		return freezedPane;
	}

	function freezePane(tobeimplemented) {
		console.log('Worksheet function: freezePane incomplete');
	}

	function freezePaneByColumnAndRow(tobeimplemented) {
		console.log('Worksheet function: freezePaneByColumnAndRow incomplete');
	}

	function unfreezePane() {
		freezePane('');
	}

	function insertNewRowBefore(tobeimplemented) {
		console.log('Worksheet function: insertNewRowBefore incomplete');
	}

	function insertNewColumnBefore(tobeimplemented) {
		console.log('Worksheet function: insertNewColumnBefore incomplete');
	}

	function insertNewColumnBeforeByIndex(tobeimplemented) {
		console.log('Worksheet function: insertNewColumnBeforeByIndex incomplete');
	}

	function removeRow(tobeimplemented) {
		console.log('Worksheet function: removeRow incomplete');
	}

	function removeColumn(tobeimplemented) {
		console.log('Worksheet function: removeColumn incomplete');
	}

	function removeColumnByIndex(tobeimplemented) {
		console.log('Worksheet function: removeColumnByIndex incomplete');
	}

	function getShowGridlines() {
		return showGridLines;
	}

	function setShowGridlines(lines) {
		if (lines === undefined) {
			lines = false;
		}
		showGridLines = lines;
		return self;
	}

	function getPrintGridlines() {
		return printGridLines;
	}

	function setPrintGridlines(lines) {
		if (lines === undefined) {
			lines = false;
		}
		printGridLines = lines;
		return self;
	}

	function getShowRowColHeaders() {
		return showRowColHeaders;
	}

	function setShowRowColHeaders(show) {
		if (show === undefined) {
			show = false;
		}
		showRowColHeaders = show;
		return self;
	}

	function getShowSummaryBelow() {
		return showSummaryBelow;
	}

	function setShowSummaryBelow(show) {
		if (show === undefined) {
			show = false;
		}
		showSummaryBelow = show;
		return self;
	}

	function getShowSummaryRight() {
		return showSummaryRight;
	}

	function setShowSummaryRight(show) {
		if (show === undefined) {
			show = false;
		}
		showSummaryRight = show;
		return self;
	}

	function getComments() {
		return comments;
	}

	function setComments(commentsArray) {
		comments = commentsArray;
		return self;
	}

	function getComment(tobeimplemented) {
		console.log('Worksheet function: getComment incomplete');
	}

	function getCommentByColumnAndRow(tobeimplemented) {
		console.log('Worksheet function: getCommentByColumnAndRow incomplete');
	}

	function getSelectedCells() {
		return selectedCells;
	}

	function getSelectedCell() {
		return getSelectedCells();
	}

	function getActiveCell() {
		return activeCell;
	}

	function setSelectedCells(tobeimplemented) {
		console.log('Worksheet function: setSelectedCells incomplete');
	}

	function setSelectedCell(coord) {
		return setSelectedCells(coord);
	}

	function setSelectedCellByColumnAndRow(tobeimplemented) {
		console.log('Worksheet function: setSelectedCellByColumnAndRow incomplete');
	}

	function getRightToLeft() {
		return rightToLeft;
	}

	function setRightToLeft(show) {
		if (show === undefined) {
			show = false;
		}
		rightToLeft = show;
		return self;
	}

	function fromArray(tobeimplemented) {
		console.log('Worksheet function: fromArray incomplete');
	}

	function rangeToArray(tobeimplemented) {
		console.log('Worksheet function: rangeToArray incomplete');
	}

	function namedRangeToArray(tobeimplemented) {
		console.log('Worksheet function: namedRangeToArray incomplete');
	}

	function toArray(tobeimplemented) {
		console.log('Worksheet function: toArray incomplete');
	}

	function getRowIterator(tobeimplemented) {
		console.log('Worksheet function: getRowIterator incomplete');
	}

	function garbageCollect(tobeimplemented) {
		console.log('Worksheet function: garbageCollect incomplete');
	}

	function getHashCode(tobeimplemented) {
		console.log('Worksheet function: getHashCode incomplete');
	}

	function extractSheetTitle(tobeimplemented) {
		console.log('Worksheet function: extractSheetTitle incomplete');
	}

	function getHyperlink(tobeimplemented) {
		console.log('Worksheet function: getHyperlink incomplete');
	}

	function setHyperlink(tobeimplemented) {
		console.log('Worksheet function: setHyperlink incomplete');
	}

	function hyperlinkExists(tobeimplemented) {
		console.log('Worksheet function: hyperlinkExists incomplete');
	}

	function getHyperlinkCollection() {
		return hyperLinkCollection;
	}

	function getDataValidation(tobeimplemented) {
		console.log('Worksheet function: getDataValidation incomplete');
	}

	function setDataValidation(tobeimplemented) {
		console.log('Worksheet function: setDataValidation incomplete');
	}

	function dataValidationExists(tobeimplemented) {
		console.log('Worksheet function: dataValidationExists incomplete');
	}

	function getDataValidationCollection() {
		return dataValidationCollection;
	}

	function shrinkRangeToFit(tobeimplemented) {
		console.log('Worksheet function: shrinkRangeToFit incomplete');
	}

	function getTabColor(tobeimplemented) {
		console.log('Worksheet function: getTabColor incomplete');
	}

	function resetTabColor(tobeimplemented) {
		console.log('Worksheet function: resetTabColor incomplete');
	}

	function isTabColorSet(tobeimplemented) {
		console.log('Worksheet function: isTabColorSet incomplete');
	}

	function copy(tobeimplemented) {
		console.log('Worksheet function: copy incomplete');
	}

	function __clone(tobeimplemented) {
		console.log('Worksheet function: __clone incomplete');
	}

	function initialise() {
		if (excel === undefined) {
			parent = null;
		} else {
			parent = excel;
		}

		if (title === undefined) {
			setTitle('sheet');
		} else {
			setTitle(title);
		}

		drawingCollection = {};
		chartCollection = {};

		cellCollection = cachedObjectStorageFactory.getInstance(self);

		setSheetState(constants.sheetState.visible);
	}

	self.disconnectCells = disconnectCells;
	self.getParent = getParent;
	self.setTitle = setTitle;
	self.getTitle = getTitle;
	self.getHashCode = getHashCode;
	self.getInvalidTitleCharacters = getInvalidTitleCharacters;
	self.getCellCacheController = getCellCacheController;
	self.sortCellCollection = sortCellCollection;
	self.getRowDimensions = getRowDimensions;
	self.getDefaultRowDimension = getDefaultRowDimension;
	self.getColumnDimensions = getColumnDimensions;
	self.getDefaultColumnDimension = getDefaultColumnDimension;
	self.getDrawingCollection = getDrawingCollection;
	self.getChartCollection = getChartCollection;
	self.addChart = addChart;
	self.getChartCount = getChartCount;
	self.getChartByIndex = getChartByIndex;
	self.getChartNames = getChartNames;
	self.getChartByName = getChartByName;
	self.refreshColumnDimensions = refreshColumnDimensions;
	self.refreshRowDimensions = refreshRowDimensions;
	self.calculateWorksheetDimension = calculateWorksheetDimension;
	self.calculateWorksheetDataDimension = calculateWorksheetDataDimension;
	self.calculateColumnWidths = calculateColumnWidths;
	self.rebindParent = rebindParent;
	self.getSheetState = getSheetState;
	self.setSheetState = setSheetState;
	self.getPageSetup = getPageSetup;
	self.setPageSetup = setPageSetup;
	self.getPageMargins = getPageMargins;
	self.setPageMargins = setPageMargins;
	self.getHeaderFooter = getHeaderFooter;
	self.setHeaderFooter = setHeaderFooter;
	self.getSheetView = getSheetView;
	self.setSheetView = setSheetView;
	self.getProtection = getProtection;
	self.setProtection = setProtection;
	self.getHighestColumn = getHighestColumn;
	self.getHighestDataColumn = getHighestDataColumn;
	self.getHighestRow = getHighestRow;
	self.getHighestDataRow = getHighestDataRow;
	self.setCellValue = setCellValue;
	self.setCellValueByColumnAndRow = setCellValueByColumnAndRow;
	self.setCellValueExplicit = setCellValueExplicit;
	self.setCellValueExplicitByColumnAndRow = setCellValueExplicitByColumnAndRow;
	self.getCell = getCell;
	self.getCellByColumnAndRow = getCellByColumnAndRow;
	self.cellExists = cellExists;
	self.cellExistsByColumnAndRow = cellExistsByColumnAndRow;
	self.getRowDimension = getRowDimension;
	self.getColumnDimension = getColumnDimension;
	self.getColumnDimensionByColumn = getColumnDimensionByColumn;
	self.getStyles = getStyles;
	self.getDefaultStyle = getDefaultStyle;
	self.setDefaultStyle = setDefaultStyle;
	self.getStyle = getStyle;
	self.getConditionalStyles = getConditionalStyles;
	self.conditionalStylesExists = conditionalStylesExists;
	self.removeConditionalStyles = removeConditionalStyles;
	self.getConditionalStylesCollection = getConditionalStylesCollection;
	self.setConditionalStyles = setConditionalStyles;
	self.getStyleByColumnAndRow = getStyleByColumnAndRow;
	self.setSharedStyle = setSharedStyle;
	self.duplicateStyle = duplicateStyle;
	self.duplicateConditionalStyle = duplicateConditionalStyle;
	self.duplicateStyleArray = duplicateStyleArray;
	self.setBreak = setBreak;
	self.setBreakByColumnAndRow = setBreakByColumnAndRow;
	self.getBreaks = getBreaks;
	self.mergeCells = mergeCells;
	self.mergeCellsByColumnAndRow = mergeCellsByColumnAndRow;
	self.unmergeCells = unmergeCells;
	self.unmergeCellsByColumnAndRow = unmergeCellsByColumnAndRow;
	self.getMergeCells = getMergeCells;
	self.setMergeCells = setMergeCells;
	self.protectCells = protectCells;
	self.protectCellsByColumnAndRow = protectCellsByColumnAndRow;
	self.unprotectCells = unprotectCells;
	self.unprotectCellsByColumnAndRow = unprotectCellsByColumnAndRow;
	self.getProtectedCells = getProtectedCells;
	self.getAutoFilter = getAutoFilter;
	self.setAutoFilter = setAutoFilter;
	self.setAutoFilterByColumnAndRow = setAutoFilterByColumnAndRow;
	self.removeAutoFilter = removeAutoFilter;
	self.getFreezePane = getFreezePane;
	self.freezePane = freezePane;
	self.freezePaneByColumnAndRow = freezePaneByColumnAndRow;
	self.unfreezePane = unfreezePane;
	self.insertNewRowBefore = insertNewRowBefore;
	self.insertNewColumnBefore = insertNewColumnBefore;
	self.insertNewColumnBeforeByIndex = insertNewColumnBeforeByIndex;
	self.removeRow = removeRow;
	self.removeColumn = removeColumn;
	self.removeColumnByIndex = removeColumnByIndex;
	self.getShowGridlines = getShowGridlines;
	self.setShowGridlines = setShowGridlines;
	self.getPrintGridlines = getPrintGridlines;
	self.setPrintGridlines = setPrintGridlines;
	self.getShowRowColHeaders = getShowRowColHeaders;
	self.setShowRowColHeaders = setShowRowColHeaders;
	self.getShowSummaryBelow = getShowSummaryBelow;
	self.setShowSummaryBelow = setShowSummaryBelow;
	self.getShowSummaryRight = getShowSummaryRight;
	self.setShowSummaryRight = setShowSummaryRight;
	self.getComments = getComments;
	self.setComments = setComments;
	self.getComment = getComment;
	self.getCommentByColumnAndRow = getCommentByColumnAndRow;
	self.getSelectedCell = getSelectedCell;
	self.getActiveCell = getActiveCell;
	self.getSelectedCells = getSelectedCells;
	self.setSelectedCell = setSelectedCell;
	self.setSelectedCells = setSelectedCells;
	self.setSelectedCellByColumnAndRow = setSelectedCellByColumnAndRow;
	self.getRightToLeft = getRightToLeft;
	self.setRightToLeft = setRightToLeft;
	self.fromArray = fromArray;
	self.rangeToArray = rangeToArray;
	self.namedRangeToArray = namedRangeToArray;
	self.toArray = toArray;
	self.getRowIterator = getRowIterator;
	self.garbageCollect = garbageCollect;
	self.getHashCode = getHashCode;
	self.extractSheetTitle = extractSheetTitle;
	self.getHyperlink = getHyperlink;
	self.setHyperlink = setHyperlink;
	self.hyperlinkExists = hyperlinkExists;
	self.getHyperlinkCollection = getHyperlinkCollection;
	self.getDataValidation = getDataValidation;
	self.setDataValidation = setDataValidation;
	self.dataValidationExists = dataValidationExists;
	self.getDataValidationCollection = getDataValidationCollection;
	self.shrinkRangeToFit = shrinkRangeToFit;
	self.getTabColor = getTabColor;
	self.resetTabColor = resetTabColor;
	self.isTabColorSet = isTabColorSet;
	self.copy = copy;
	self.__clone = __clone;
	initialise();

	return self;
}