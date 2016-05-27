'use strict';
var parse = require('../lightweight-csv-parser.js');

// majority of unit tests adapted from codewars problem:
// http://www.codewars.com/kata/525ca723b6aecee8c900033c
describe('basic functionality', function(){

	// TODO:
	// valid csv?
	// closed quotes?
	
	var input;
	var output;
	function test(){
		expect(parse(input)).toEqual(output);
	};
	
	
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
	
	var input;
	var output;
	function test(){
		expect(parse(input)).toEqual(output);
	};
	
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
	
	it('should throw an error on finding a misplaced unescaped quote', function(){
		
	});

});