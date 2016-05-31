'use strict';
var parseFactory = require('../lightweight-csv-parser.js');



// majority of unit tests adapted from codewars problem:
// http://www.codewars.com/kata/525ca723b6aecee8c900033c
var parser;
beforeEach(function(){
	parser = parseFactory();
});

var input;
var output;


describe('toNestedArray:', function(){

	function test(separator, quote){
		expect(parser.parseData(input, separator, quote).toNestedArray()).toEqual(output);
	}

	describe('input validation', function(){

		it('should throw if multicharacter separator', function(){
			expect( () => {
				return parser.parseData('ok', 'bad', null).toNestedArray();
			}).toThrow(new Error ('Invalid separator'));
		});

		it('should throw if multicharcter quote', function(){
			expect( () => {
				return parser.parseData('ok', null, 'bad').toNestedArray();
			}).toThrow(new Error ('Invalid quote'));
		});

		it('should throw if passed a non-string input', function(){
			expect( () => {
				return parser.parseData([1,2,3]).toNestedArray();
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


		// The kicker!
		it('should handle a quoted field in the last index (?)', function(){
			// isolating the issue

			// this should work
			input = '1,"2",\n"4,5",6';
			output = [['1','2',''],['4,5','6']];
			test();

			// meanwhile, this fails
			input = '1,"2",\n4,"5,6"';
			output = [['1','2',''],['4','5,6']];
			test();

			input = '1,2,3\n4,"5,6"';
			output = [['1','2','3'],['4','5,6']];
			test();

			input = '"a ""string"" using "" as the quote","multi\nline",\n1,2,"3,4"';
			output = [['a "string" using " as the quote','multi\nline',''],['1','2','3,4']];
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

		it('should handle using backslash as the quote', function(){
			input = '\\a \\\\string\\\\ using \\ as the quote\\.\\multi\nline\\.\n1.2.\\3.4\\';
			output = [["a \\string\\ using \\ as the quote","multi\nline",""],["1","2","3.4"]];
			test('.','\\');
		});

	});

});



describe('toJSON:', function(){

	function test(separator, quote){
		expect(parser.parseData(input, separator, quote).toJSON()).toEqual(output);
	}

	// Is this the behavior we want?
	xit('should handle a single row', function(){
		input = '1,2,3';
		output = [{
			'1':'',
			'2':'',
			'3':''
		}];
		test();
	});

	// NB: parse ints or no?

	it('should handle simple input', function(){
		input = '1,2,3\n4,5,6';
		output = [{
		    "1": "4",
		    "2": "5",
		    "3": "6"
		  }];
		test();
	});
	
	it('should handle empty fields', function(){
		input = '1,,3\n4,5,\n,8,9';
		output = [{
			"1": "4",
			"": "5",
			"3": ""
		},
		{
			"1":"",
			"":"8",
			"3":"9"
		}];
		test();
	});

	it('should handle complex inputs', function(){

		input = 'one,",,,,,..two,,,,,\n,,,,,,",three\n4,,6\n7,"8,9",10';
		output = [
		  {
		    "one": '4',
		    ",,,,,..two,,,,,\n,,,,,,": '',
		    "three": "6"
		  },
		  {
		    "one": '7',
		    ",,,,,..two,,,,,\n,,,,,,": "8,9",
		    "three": '10'
		  }
		];
		test();
	});
	
	it('should handle other also complex inputs', function(){
		input = `test	field 2	field 3	field 4`+
		`JUVO	RQNZ	ESNR	OZLY`+
		`CMAI	XECU	UXYN	WNUR`+
		`YCEE	ADHO	WMCE	WSNK`+
		`HUUX	DCEN	DWUX	FCFX`+
		`CXAI	XDBT	INNP	MOZM`;
		
		output = [
		  {
			"test": "JUVO",
			"field 2": "RQNZ",
			"field 3": "ESNR",
			"field 4": "OZLY"
		  },
		  {
			"test": "CMAI",
			"field 2": "XECU",
			"field 3": "UXYN",
			"field 4": "WNUR"
		  },
		  {
			"test": "YCEE",
			"field 2": "ADHO",
			"field 3": "WMCE",
			"field 4": "WSNK"
		  },
		  {
			"test": "HUUX",
			"field 2": "DCEN",
			"field 3": "DWUX",
			"field 4": "FCFX"
		  },
		  {
			"test": "CXAI",
			"field 2": "XDBT",
			"field 3": "INNP",
			"field 4": "MOZM"
		  }
		];
		
		test('\t');
	});
});