$(document).ready(function(){
  var s = srfi13;
  
  module("srfi13.js");
  
  test("is_string", function () {
    equal( s.is_string(""),
           true,
           "The empty string literal is a string" );
    
    equal( s.is_string("hello"),
           true,
           "The string literal 'hello' is a string" );
    
    equal( s.is_string(new String("")),
           true,
           "The empty string object is a string" );
    
    equal( s.is_string(new String("hello")),
           true,
           "The string object 'hello' is a string" );
    
    equal( s.is_string(42),
           false,
           "The number 42 is not a string" );
  });
  
  
  test("is_string_null", function () {
    equal( s.is_string_null(""),
           true,
           "The empty string literal returns true" );
    
    equal( s.is_string_null(new String("")),
           true,
           "The empty string object returns true" );
    
    equal( s.is_string_null("hello"),
           false,
           "The string literal 'hello' returns false" );
  });
  
  
  test("every", function () {
    // every(char, str)
    equal( s.every("a", "aaa"),
           true,
           "every char in 'aaa' === 'a' returns true" );
    
    equal( s.every("a", "ada"),
           false,
           "every char in 'ada' === 'a' returns false" );
    
    // every(char_set, str)
    equal( s.every("abc", "cbabc"),
           true,
           "each char in 'cbabc' is in the char_set 'abc'" );
    
    equal( s.every("abc", "abcde"),
           false,
           "there are chars in 'abcde' not present in the char_set 'abc'" );
    
    // every(pred, str)    
    equal( s.every(function (x) { return x === "a"; }, "aaa"),
           true,
           "pred(chr) returns true for every char in the string literal 'aaa'" );
    
    equal( s.every(function (x) { return x === "a"; }, "ada"),
           false,
           "pred(chr) doesn't return true for every char in the string literal 'aaa'" );
    
    // every(char, str, start, stop)
    equal( s.every("a", "cdaa", 2),
           true,
           "every char in 'cdaa' starting from index[2] is === 'a'" );
    
    equal( s.every("a", "cdaar", 2, 4),
           true,
           "every char in 'cdaar' starting from index[2] and ending at index[4] is === 'a'" );
  });
    
    
  test("any", function () {
    // any(char, str)
    equal( s.any("a", "cbabc"),
           true,
           "any char in 'cbabc' === 'a' returns true" );
    
    equal( s.any("a", "bcd"),
           false,
           "any char in 'bcd' === 'a' returns false" );
    
    // any(char_set, str)
    equal( s.any("abc", "fedc"),
           true,
           "any char in 'fedc' is in the char_set 'abc'" );
    
    equal( s.any("xyz", "abcde"),
           false,
           "No chars in 'abcde' are present in the char_set 'xyz'" );
    
    // any(pred, str)    
    equal( s.any(function (x) { return x === "a"; }, "cbabc"),
           true,
           "pred(chr) returns true for any char in the string literal 'cbabc'" );
    
    equal( s.any(function (x) { return x === "a"; }, "xyz"),
           false,
           "pred(chr) doesn't return true for any char in the string literal 'xyz'" );
    
    // any(char, str, start, stop)
    equal( s.any("a", "dcba", 2),
           true,
           "any char in 'cdaa' starting from index[2] is === 'a'" );
    
    equal( s.any("a", "cdaar", 2, 4),
           true,
           "any char in 'cdaar' starting from index[2] and ending at index[4] is === 'a'" );
    
    equal( s.any("a", "abc", 1),
           false,
           "'a' is not in the substring 'abc'[1:]" );
    
    equal( s.any("a", "abcba", 1, 4),
           false,
           "'a' is not in the substring abcba[1:4]" );
  });
  
  
  test("make_string", function () {
    var fn = (function () {
      var c = 0;
      
      var fn = function () {
        c += 1;
        return c.toString(10);
      };
      return fn;
    })();
    
    equal( s.make_string(3, "a"),
           "aaa",
           "make a string of length 1 filled with 'a' characters" );
    
    equal( s.make_string(3, fn),
           "123",
           "call fn for each index of the new string" );
  });
  
  
  test("tabulate", function () {
    equal( s.tabulate(3, function (x) { return x.toString(); }),
           "012",
           "call fn(i) for each index of the new string" );
  });
  
  
});
  