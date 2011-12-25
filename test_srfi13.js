$(document).ready(function(){
  var s = srfi13;
  
  module("srfi13.js");
  
  
  //________________________________________________________________________//
  // Predicates
  //________________________________________________________________________//
  
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
  
  
  test("starts_with", function () {
    equal( s.starts_with("hello", "he"),
           true,
           "'hello' starts with 'he'" );
    
    equal( s.starts_with("hello", "he", 1),
           false,
           "'ello' does not start with 'he'" );
    
    equal( s.starts_with("hello", "he", 0, 1),
           false,
           "'h' does not start with 'he'" );
    
    equal( s.starts_with("hello", ["we", "he", "do"]),
           true,
           "'hello' starts with a prefix in the array ['we', 'he', 'do']" );
  });
  
  
  test("ends_with", function () {
    equal( s.ends_with("hello", "lo"),
           true,
           "'hello' ends with 'lo'" );
    
    equal( s.ends_with("hello", "llo", 3),
           false,
           "'lo' does not end with 'llo'" );
    
    equal( s.ends_with("hello", "lo", 0, -2),
           false,
           "'hel' does not end with 'lo'" );
    
    equal(s.ends_with("hello", ["we", "lo", "do"]),
          true,
          "'hello' ends with a suffix in the array ['we', 'lo', 'do']" );
  });
  
  
  //________________________________________________________________________//
  // Constructors
  //________________________________________________________________________//
  
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
  
  
  //________________________________________________________________________//
  // Array & string conversion
  //________________________________________________________________________//
  
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
  
  
  //________________________________________________________________________//
  // Selection
  //________________________________________________________________________//
  
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
  
  
  test("take", function () {
    equal( s.take("world", 3),
           "wor",
           "take first 3 chars" );
  });
  
  
  test("drop", function () {
    equal( s.drop("world", 3),
           "ld",
           "drop the first 3 chars" );
  });
  
  
  test("take_right", function () {
    equal( s.take_right("world", 3),
           "rld",
           "take the last 3 chars" );
  });
  
  
  test("drop_right", function () {
    equal( s.drop_right("world", 3),
           "wo",
           "drop the last 3 chars" );
  });
  
  
  test("pad", function () {
    equal( s.pad("325", 5),
           "  325",
           "pad the string '325' with 2 spaces in front" );
    
    equal( s.pad("71325", 5),
           "71325",
           "'71325' is length 5 so just return the string" );
    
    equal( s.pad("8871325", 5),
           "71325",
           "'8871325' is length 7 so truncate it by removing the first 2 chars" );
    
    equal( s.pad("325", 5, '.'),
           "..325",
           "pad with optional char argument to use as padding" );
    
    equal( s.pad("12345", 5, " ", 2),
           "  345",
           "pad with optional start argument" );
    
    equal( s.pad("12345", 5, " ", 2, 4),
           "   34",
           "pad with optional start and end arguments" );
    
    equal( s.pad("12345", 5, " ", -4, -2),
           "   23",
           "pad with negative start and end arguments" );
  });
  
  
  test("trim_left", function () {
    equal( s.trim_left("  abc"),
           "abc",
           "trim whitespace" );
    
    equal( s.trim_left("abc"),
           "abc",
           "string with nothing to trim" );
    
    equal( s.trim_left("a   abc", " \n\r", 1),
           "abc",
           "trim whitespace from substring starting at index[1]" );
    
    equal( s.trim_left("aaabbb", "a"),
           "bbb",
           "trim 'a' chars" );
    
    equal( s.trim_left("abccba", "ab"),
           "ccba",
           "trim 'a' and 'b' chars" );
    
    equal( s.trim_left("aabb", function (x) { return x === "a"; }),
           "bb",
           "trim 'a' chars using a predicate function" );
  });
  
  
  test("trim_right", function () {
    equal( s.trim_right("abc  "),
           "abc",
           "trim whitespace" );
    
    equal( s.trim_right("abc"),
           "abc",
           "string with nothing to trim" );
    
    equal( s.trim_right("abc   a", " \n\r", 0, -1),
           "abc",
           "trim whitespace from substring starting at index[1]" );
    
    equal( s.trim_right("bbbaaa", "a"),
           "bbb",
           "trim 'a' chars" );
    
    equal( s.trim_right("abccba", "ab"),
           "abcc",
           "trim 'a' and 'b' chars" );
    
    equal( s.trim_right("bbaa", function (x) { return x === "a"; }),
           "bb",
           "trim 'a' chars using a predicate function" );
  });
  
  
  test("trim", function () {
    equal( s.trim("  abc  "),
           "abc",
           "trim whitespace" );
    
    equal( s.trim("aabbaa", "a"),
           "bb",
           "trim 'a'" );
    
    equal( s.trim("baaccaab", "a", 1, -1),
           "cc",
           "trim 'a' from str[1:-1]" );
  });
  
  
  //________________________________________________________________________//
  // 
  //________________________________________________________________________//
  
  
});
  