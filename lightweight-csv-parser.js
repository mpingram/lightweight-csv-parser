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

  var output = [];
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
  return output;
}


// for testing
try{
  module.exports = parseCSV;

} catch (e){
  // we're not running in node,
  // apologize to the compiler
}