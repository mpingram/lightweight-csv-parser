'use strict';
var parser = require('../lightweight-csv-parser.js');
	
var customMatchers = {
	toBeArrayOfTuples: function(){
		return{
			compare: function(actual){

				var result = {};
				var passed = true;

				if (Array.isArray(actual)){
					for (var i=0;i<actual.length;i++){
						if (!Array.isArray(actual[i]) || actual[i].length!==2){
							passed = false;
						}
					}
				} else {
					passed = false;
				}

				result.pass = passed;
				return result;
			}
		};
	}
};

describe('parser.findQuotes', function(){

	var testInput = `field 1, field 2, field 3, field 4
value, valuuuueeeee, vaaaaaalllllluuuuue, val
ue, välüë, "value", vulae
v, v, v, "v"
v"value"alue, valeu, valieu`;
	

	beforeEach(function(){
		jasmine.addMatchers(customMatchers);
	});

	it('should throw an error on invalid input', function(){
		expect( () => { return parser.findQuotes({value: 'nope'}); }).toThrow(new Error('Invalid input at findQuotes'));
	});

	it('should return an array of tuples', function(){
		expect(parser.findQuotes(testInput)).toBeArrayOfTuples();
		console.log(parser.findQuotes(testInput));
	});

	it('should return the correct indices', function(){
		var validOutput = [
			[92,98],
			[116,118],
			[121,127]
		];
		expect(parser.findQuotes(testInput)).toEqual(validOutput);
	});

});
