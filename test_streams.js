$(document).ready(function () {
  var s = streams;
  
  module("streams.js");
  
  test("Promise", function () {
    var p = new s.Promise( function () { return 42; } );
    
    equal( p instanceof s.Promise,
           true,
           "p is instanceof Promise" );
    
    equal( p.data === null,
           true,
           "p has not been forced so p.data is still null" );
    
    equal( p.toString(),
           "[object Promise]",
           "toString returns [object Promise]" );
  });
  
  
  test("is_promise", function () {
    var p = new s.Promise( function () { return 42; } );
    
    equal( s.is_promise(p),
           true,
           "a promise is a promise" );
    
    equal( s.is_promise(42),
           false,
           "a number is not" );
  });
  
  
  test("delay", function () {
    var p = s.delay( function () { return 42; } );
    
    equal( p instanceof s.Promise,
           true,
           "p is instanceof Promise" );
    
    equal( p.data === null,
           true,
           "p has not been forced so p.data is still null" );
    
    equal( p.toString(),
           "[object Promise]",
           "toString returns [object Promise]" );
    
    raises( function () { s.delay(42); },
            "argument to delay must be a thunk (function with no arguments)",
            "delay called with an argument that is not a thunk" );
  });
  
  
  test("force", function () {
    var c = 0,
        p = s.delay( function () { c++; return 42; } ),
        pp, x;
    
    equal( s.force(p),
           42,
           "forcing p returns 42" );
    
    equal( c === 1,
           true,
           "forcing p for the first time increments c" )
    
    equal( s.force(p),
           42,
           "forcing p again still returns 42" );
    
    equal( c === 1,
           true,
           "forcing p a second time does not increment c, p's value should be cached" );
    
    // forcing non-promise expressions
    
    equal( s.force(64),
           64,
           "force a number" );
    
    equal( s.force("hello"),
           "hello",
           "force a string" );
    
    equal( s.force(function () { return "hi"; }) instanceof Function,
           true,
           "force an anonymous function" );
    
    // promise refering to its own value
    
    c = 0;
    pp = s.delay( function () { 
      c++;
      if (c > x) {
        return c;
      }
      else {
        return s.force(pp);
      }
    } );
    
    x = 5;
    
    equal( s.force(pp),
           6,
           "s.force(pp) loops (incrementing c) until c > x then returns 6" );
    
    equal( c === 6,
           true,
           "s.force(pp) increments c to 6" );
    
    x = 10;
    
    equal( s.force(pp),
           6,
           "6 is already cached so force(pp) returns the cached value (no looping occurs)" );
    
    equal( c === 6,
           true,
           "c remains === 6" );
    
  });
  
  
});