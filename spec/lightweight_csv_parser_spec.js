'use strict';
var parse = require('../lightweight-csv-parser.js');

var input;
var output;
function test(separator, quote){
	expect(parse(input, separator, quote)).toEqual(output);
}

// majority of unit tests adapted from codewars problem:
// http://www.codewars.com/kata/525ca723b6aecee8c900033c

describe('input validation', function(){

	it('should throw if multicharacter separator', function(){
		expect( () => {
			return parse('ok', 'bad', null);
		}).toThrow(new Error ('Invalid separator'));
	});

	it('should throw if multicharcter quote', function(){
		expect( () => {
			return parse('ok', null, 'bad');
		}).toThrow(new Error ('Invalid quote'));
	});

	it('should throw if passed a non-string input', function(){
		expect( () => {
			return parse([1,2,3]);
		}).toThrow(new Error ('Invalid input'));
	});

});


describe('basic functionality', function(){

	// TODO:
	// valid csv?
	// closed quotes?
	
	it('should handle a single row', function(){
		input = '1,2,3';
		output = [["1","2","3"]];
		test();
	});
	
	it('should handle simple input', function(){
		input = '1,2,3\n4,5,6';
		output = [["1","2","3"],["4","5","6"]];
		test();
	});
	
	it('should handle empty fields', function(){
		input = '1,,3\n4,5,\n,7,8';
		output = [["1","","3"],["4","5",""],["","7","8"]];
		test();
	});
	
	it('should handle spaces within fields', function(){
		input = '1, 2 ,3\n4,5,6';
		output = [["1"," 2 ","3"],["4","5","6"]];
		test();
	});
	
	it('should handle uneven rows', function(){
		input = '1,2,3,4,5,6\n7,8\n9,10,11,12';
		output = [["1","2","3","4","5","6"],["7","8"],["9","10","11","12"]];
		test();
	});
	
	it('should handle empty rows', function(){
		input = '1,2,3\n\n4,5,6';
		output = [["1","2","3"],[""],["4","5","6"]];
		test();
	});
});

describe('quoted fields', function(){
		
	it('should handle quoted fields', function(){
		input = '1,"two was here",3\n4,5,6';
		output = [["1","two was here","3"],["4","5","6"]];
		test();
	});
	
	it('should handle empty quoted fields', function(){
		input = '1,"",3\n4,5,6';
		output = [["1","","3"],["4","5","6"]];
		test();
	});
	
	it('should handle leading and trailing spaces in quoted fields', function(){
		input = '1," two ",3\n4,5,6';
		output = [["1"," two ","3"],["4","5","6"]];
		test();
	});
	
	it('should handle separators in quoted fields', function(){
		input = '1,"two, too",3\n4,5,6';
		output = [["1","two, too","3"],["4","5","6"]];
		test();
	});
	
	it('should handle multi-line quoted fields', function(){
		input = '1,"two was\nup there",3\n4,5,6';
		output = [["1","two was\nup there","3"],["4","5","6"]];
		test();
	});
	
	it('should handle separators in multiline quoted fields', function(){
		input = 'one,",,,,,..two,,,,,\n,,,,,,",three\n4,,6';
		output = [["one",",,,,,..two,,,,,\n,,,,,,","three"],["4","","6"]];
		test();
	});
	
	it('should handle quote characters within quoted fields', function(){
		input = '1,"two ""quote""",3\n4,5,6';
		output = [["1","two \"quote\"","3"],["4","5","6"]];
		test();
	});
	
	it('should handle several escaped quotes in a row', function(){
		input = '1," here: \"\"\"\"",3\n4,5,6';
		output = [['1',' here: ""','3'],['4','5','6']];
		test();
	});
	
	// DEBUG: should it?
	xit('should throw an error on finding a misplaced unescaped quote', function(){
		input = '1,"bad"quote",3\n4,5,6';
		var index = input.indexOf('\"quote');
		expect( () => { return parse(input) } ).toThrow(new Error('Invalid CSV at index '+index));
	});

});

describe('alternate separators', function(){

	it('should handle tab delineated files', function(){
		input = '1\t2\t3\n4\t5\t6';
		output = [['1','2','3'],['4','5','6']];
		test('\t');
	})

	it('should handle weird separators', function(){
		input = '1\\2\\3\n4\\5\\6';
		output = [['1','2','3'],['4','5','6']];
		test('\\');
		input = '1*2*3\n4*5*6';
		test('*');
		input = '1 2 3\n4 5 6';
		test(' ');
	});

});

describe('alternate quotes', function(){

	it('should handle single quotes', function(){
		input = "1,'two ''quote''',3\n4,5,6";
		output = [["1","two \'quote\'","3"],["4","5","6"]];
		test(null, '\'');
	});

	it('should handle weird characters as the quote', function(){
		input = '$a $$string$$ using $$ as the quote$.$multi\nline$.\n1.2.$3.4$';
		output = [["a $string$ using $ as the quote","multi\nline",""],["1","2","3.4"]];
		test('.','$');
	});

	// NOTE TO SELF IMPORTANT BUG
	// 
	it('should handle using backslash as the quote', function(){
		input = '\\a \\\\string\\\\ using \\ as the quote\\.\\multi\nline\\.\n1.2.\\3.4\\';
		output = [["a \\string\\ using \\ as the quote","multi\nline",""],["1","2","3.4"]];
		test('.','\\');
	});
})