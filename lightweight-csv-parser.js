'use strict';
/**
 * Factory function for CSV Parser. Constructor takes a string.
 * 
 * @param input String, CSV input
 * @param separator String, single character used to separate fields.
 *        Defaults to ","
 * @param quote String, single character used to quote non-simple fields.
 *        Defaults to "\"".
 */
function parseCSV() {

  var self = {};

  self.output = [];

  self.parseData = function(input, separator, quote){

    separator = separator || ',';
    quote = quote || '\"';

    // clearing self.output
    self.output = [];
    
    // input validation
    // --------------------
    if (typeof input !== 'string'){
      throw new Error('Invalid input');
    }
    if (typeof separator !== 'string' ||
       separator.length > 1 ||
       separator === '\n' ||
       separator === quote){
      throw new Error('Invalid separator');
    }
    if (typeof quote !== 'string' ||
       quote.length > 1 ||
       quote === '\n'){
      throw new Error('Invalid quote');
    }
    if (input===''){
        return [['']];
    }
    // ---------------------


      

    input = input.split('');

    // DEBUG:
    // is this a reference?
    // It should be
    var output = self.output;
    var line = [];
    var value = '';

    function pushValue(){
    	line.push(value);
    	value = '';
    }
    function pushLine(){
    	line.push(value);
    	output.push(line);
    	line = [];
    	value = '';
    }

    var inQuotes = false;
    var endOfInput = input.length-1;


    for (var i=0;i<input.length;i++){

      // if we're in quotes, eat everything except
      // the next unescaped quote character.
      if (inQuotes){
        if(input[i] !== quote){
          value += input[i];
  		  
        // character is quote;
        // if the next character is a break it must
        // be an unescaped quote.
        } else if (input[i+1] === separator || input[i+1] === '\n' || i+1 === endOfInput){
          inQuotes = false; 
  		  

        // character is quote and also the end of input
        } else if (i === endOfInput){
          pushLine();
        
        // else, if the next character is another quote
        // this first quote is escaped.
        // add the escaped quote to the value and skip past
        // the next index, which is a quote.
        } else if (input[i+1] === quote){
          value += quote;
  		i++;

        // otherwise, what?
        } else {
          value += quote;
          //throw new Error('Invalid CSV at index '+i);
        }

      } else if (input[i] === separator){
        pushValue();

      } else if (input[i] === '\n' || i === endOfInput){
        if (i === endOfInput){
          value += input[i];
        }
        pushLine();

      } else if (input[i] === quote){
        if (input[i-1] === separator || input[i-1] === '\n' || i === 0){
          inQuotes = true;
        }
        
      } else {
        value += input[i];
      }
    }
    return this;
  };


  self.toJSON = function(params){

    var jagged;
    var firstRowFieldNames;

    if(params === undefined){
      jagged = false;
      firstRowFieldNames = true;
    } else {
      if(params.jagged){
        jagged = true;
      }
      if (!params.firstRowFieldNames){
        firstRowFieldNames = false;
      }
    }

    // in case something weird happened to
    // the output
    if (!Array.isArray(self.output)){
      throw new Error('Malformed data in self.output - try parsing again.');
    }

    var arr = self.output;
    var len = arr.length;
    // for validation of non-jagged arrays.
    var firstRowLen = arr[0].length;
    var firstRow;

    var json = [];
    var record = {};

    if(firstRowFieldNames){
      firstRow = arr[0];
    }

    var i = 0;
    if(firstRowFieldNames){
      i = 1;
    }

    for (i;i<len;i++){

      if (i===0 && firstRowFieldNames){
        i++;
      }

      for (var k=0;k<arr[i].length;k++){

        var last = arr[i].length-1;

        if(!jagged && k>=firstRowLen){
          throw new Error('Uneven rows in CSV input. (if this is intended, pass {jagged:true} to .toJSON() method.');
        }

        if(firstRowFieldNames){
          // DEBUG: compiler appears to do type conversion of
          // string -> number without asking.
          // This shouldn't be an issue...?
          record[firstRow[k]] = arr[i][k];
        } else {
          record[k.toString()] = arr[i][k];
        }

        if(k === last){
          json.push(record);
          record = {};
        }
      }
    }

    return json;

  };

  self.toNestedArray = function(){
    return self.output;
  };

  return self;
}


// for testing
try{
  module.exports = parseCSV;

} catch (e){
  // we're not running in node,
  // apologize to the compiler
}