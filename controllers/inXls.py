# This script extracts OSM link information from a .xls file and writes only the links that are roads into a new .xls file.

print 'Converting XLS to CSV...'

# xlrd library found at (http://pypi.python.org/pypi/xlrd)
import xlrd
import csv 
from optparse import OptionParser

parser = OptionParser();
parser.add_option("-f", "--file", dest="filename", help="Excel file to convert to CSV format", metavar="FILE")
(options, args) = parser.parse_args();

if options.filename != None:
	FILE_NAME = options.filename
	wb = xlrd.open_workbook(FILE_NAME) 

	for name in wb.sheet_names(): 
		filename = options.filename + '-%s.csv' % name
		out = file(filename, 'wb')
		print 'Saving file "' + filename + '"'
		writer = csv.writer(out) 
		sheet = wb.sheet_by_name(name) 
		for row in xrange(sheet.nrows): 
			writer.writerow([ 
				sheet.cell_value(row, col) 
				for col in xrange(sheet.ncols) 
				]) 
		out.close() 
else:
	print 'No file argument passed in!'

print 'Done!'
	

