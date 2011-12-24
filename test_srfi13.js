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
  
  
  
  
  
});
  