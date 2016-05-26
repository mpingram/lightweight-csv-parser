// find quote characters in input fields and
// return array of tuples representing [startIndex, endIndex].
// Assumes well-formed CSV input.
function findQuotes(input, separator, quote){
  separator = separator || ',';
  quote = quote || '\"';

  if (typeof input !== 'string'){
      throw new Error('Invalid input at findQuotes');
    }
  var output = [];
  var tuple = [];
  
  for (var i=0;i<input.length;i++){
    if (input[i] === quote){
      tuple.push(i);
    }
    if (tuple.length>1){
      output.push(tuple);
      tuple = [];
    }
  }
  return output;
}

/**
 * CSV Parser.  Takes a string as input and returns
 * an array of arrays (for each row).
 * 
 * @param input String, CSV input
 * @param separator String, single character used to separate fields.
 *        Defaults to ","
 * @param quote String, single character used to quote non-simple fields.
 *        Defaults to "\"".
 */
function parseCSV(input, separator, quote) {

  separator = separator || ',';
  quote = quote || '\"';

  if (typeof input !== 'string'){
    throw new Error('Invalid input');
  }
  if (typeof separator !== 'string' || separator.length > 1){
    throw new Error('Invalid separator');
  }
  if (typeof quote !== 'string' || quote.length > 1){
    throw new Error('Invalid quote');
  }

  if (input===''){
      return [['']];
  }

  input = input.split('');

  var output = [];
  var line = [];
  var value = '';

  var inQuotes = false;
  var endOfInput = input.length-1;

  for (var i=0;i<input.length;i++){

    // if we're in quotes, eat everything except
    // the next unescaped quote character.
    if (inQuotes){
      if(input[i] !== quote){
        value += input[i];

      } else if (input[i] === quote && input[i+1] === quote){
        value += quote; 
      // else, this is an unescaped quote:
      // we're no longer in quotes.
      } else {
        inQuotes = false;
      }

    } else if (input[i] === separator){
      line.push(value);
      value = '';

    } else if (input[i] === '\n' || i === endOfInput){
      if (i === endOfInput){
        value += input[i];
      }
      line.push(value);
      output.push(line);
      value = '';
      line = [];

    } else if (input[i] === quote){
      if (input[i-1] === separator || input[i-1] === '\n' || i === 0){
        inQuotes = true;
      }
      
    } else {
      value += input[i];
    }
  }
  
  return output;
};


// for testing
try{
  module.exports.parseCSV = parseCSV;
  module.exports.findQuotes = findQuotes;
} catch (e){
  // we're not running in node,
  // apologize to the compiler
}