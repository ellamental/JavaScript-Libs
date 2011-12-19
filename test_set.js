$(document).ready(function(){
  module("set.js");
  
  test("Set constructor", function () {
    var a = new Set(),
        b = new Set(1),
        c = new Set(1, 2, 3),
        d = new Set(1, 2, 3, 2, 1);
    
    equal( a.length,
           0,
           "Empty set should have length 0" );
    
    equal( b.length,
           1,
           "1 element set should have length 1" );
    
    equal( c.length,
           3,
           "3 element set should have length 3" );
    
    equal( d.length,
           3,
           "5 arguments but only 3 unique values should have length 3" );
  });
  
  test("Set.equals", function () {
    var a = new Set(),
        b = new Set(1),
        c = new Set(1, 2, 3);
    
    ok( a.equals(new Set()),
        "Empty sets compare equal" );
    
    ok( b.equals(new Set(1)),
        "Single element sets containing the same element compare equal" );
    
    ok( c.equals(new Set(1, 2, 3)),
        "Sets with equal length and === elements compare equal" );
    
    ok( c.equals(new Set(3, 2, 1)),
        "Order doesn't matter" );
    
    equal( c.equals(new Set(2, 3, 4)),
           false,
           "Sets with even a single !== element do not compare equal"  );
    
    equal( c.equals(new Set(1, 2)),
           false,
           "Sets with unequal length do not compare equal" );
  });
  

});
