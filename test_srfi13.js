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
    
    // every(char, str, neg-start, neg-stop
    equal( s.every("a", "cbaa", -2),
           true,
           "every with negative start" );
    
    equal( s.every("a", "cbaabc", -4, -2),
           true,
           "every with negative start and end" );
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
    
    // any(char, str, neg-start, neg-stop)
    equal( s.any("a", "aabc", -2),
           false,
           "any with negative start" );
    
    equal( s.any("a", "aabcaa", -4, -2),
           false,
           "any with negative start and end" );
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
  
  
  test("string_to_array", function () {
    deepEqual( s.string_to_array("abc"),
               ["a", "b", "c"],
               "string to array" );
  });
  
  
  test("array_to_string", function () {
    equal( s.array_to_string(["a", "b", "c"]),
           "abc",
           "array to string" );
  });
  
  
  test("reverse_array_to_string", function () {
    equal( s.reverse_array_to_string([1, 2, 3]),
           "321",
           "reverse the given array and join the elements to return a string" );
  });
  
  
  test("join", function () {
    equal( s.join([1, 2, 3], ":"),
           "1:2:3",
           "infix join" );
    
    equal( s.join([], ":"),
           "",
           "infix join on empty list" );
    
    equal( s.join([1, 2, 3], ":", 'prefix'),
           ":1:2:3",
           "prefix join" );
    
    equal( s.join([], ":", 'prefix'),
           "",
           "prefix join on empty list" );
    
    equal( s.join([1, 2, 3], ":", 'suffix'),
           "1:2:3:",
           "suffix join" );
    
    equal( s.join([], ":", 'suffix'),
           "",
           "suffix join on empty list" );
  });
    
  
  test("length", function () {
    equal( s.length(""),
           0,
           "length of an empty string is 0" );
    
    equal( s.length("hello"),
           5,
           "length of 'hello' is 5" );
  });
  
  
  test("ref", function () {
    equal( s.ref("abc", 1),
           "b",
           "the character at 'abc'[1] is 'b'" );
  });
  
  
  test("substring", function () {
    equal( s.substring("hello", 1),
           "ello",
           "substring without end parameter" );
    
    equal( s.substring("hello", 1, 4),
           "ell",
           "substring with end parameter" );
    
    equal( s.substring("hello", 1, -2),
           "el",
           "substring with negative end parameter" );
    
    equal( s.substring("hello", -4, -2),
           "el",
           "substring with negative start and end parameters" );
  });
  
  
  
});
  