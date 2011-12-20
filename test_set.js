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
  
  
  test("Set.isEmpty", function () {
    var a = new Set(),
        b = new Set(1);
    
    equal( a.isEmpty(),
           true,
           "Empty set returns true" );
    
    equal( b.isEmpty(),
           false,
           "Non-empty set returns false" );
  });
  
  
  test("Set.add", function () {
    var a = new Set(1, 2);
    
    a.add(3);
    
    equal( a.length,
           3,
           "New length should equal 3" );
    
    equal( a.equals(new Set(1, 2, 3)),
           true,
           "a contains the elements 1, 2 and 3" );
    
    a.add(2);
    
    equal( a.length,
           3,
           "2 was already present in a so add should not increment length" );
    
    equal( a.equals(new Set(1, 2, 3)),
           true,
           "a should remain unchanged so this test should still return true" );
  });
  
  
  test("Set.update", function () {
    var a = new Set(1, 2, 3),
        b = new Set(3, 4, 5);
    
    a.update(b);
    
    equal( a.length,
           5,
           "a contains 5 elements" );
    
    equal( a.equals(new Set(1, 2, 3, 4, 5)),
           true,
           "a contains the elements 1, 2, 3, 4 and 5" );
  });
  
  
  test("Set.remove", function () {
    var a = new Set(1, 2, 3);
    
    a.remove(2);
    
    equal( a.length,
           2,
           "New length should equal 2" );
    
    equal( a.equals(new Set(1, 3)),
           true,
           "a contains the elements 1 and 3" );
    
    a.remove(42);
    
    equal( a.length,
           2,
           "Calling remove with an element not in the set should have no effect" );
    
    equal( a.equals(new Set(1, 3)),
           true,
           "Calling remove with an element not in the set should have no effect" );
  });
  
  
  test("Set.removeEvery", function () {
    var a = new Set(1, 2, 3, 4, 5, 6);
    
    // Remove every even number from the set.
    a.removeEvery(function (x) { return x % 2 === 0; });
    
    equal( a.length,
           3,
           "Length of a equals 3" );
    
    equal( a.equals(new Set(1, 3, 5)),
           true,
           "a contains only the elements 1, 3 and 5" );
  });
  
  
  test("Set.pop", function () {
    var a = new Set(1, 2),
        b = a.pop(),
        c, d;
    
    equal( a.length,
           1,
           "a only contains 1 element after a.pop()" );
    
    ok( (b === 1 || b === 2),
        "b equals an element from the set" );

    c = a.pop();
    
    equal( a.length,
           0,
           "a is empty after 2 pops" );
    
    ok( (c === 1 || c === 2),
        "c equals an element from the set" );
    
    d = a.pop();
    
    equal( a.length,
           0,
           "a is still empty after 3 pops" );
    
    ok( d === undefined,
        "d is undefined" );
  });
  
  
  test("Set.clear", function () {
    var a = new Set(1, 2, 3);
    
    a.clear();
    
    equal( a.length,
           0,
           "a.length === 0" );
    
    ok( a.isEmpty(),
        "a.isEmpty returns true" );
  });
  
  
  test("Set.member", function () {
    var a = new Set(1, 2, 3);
    
    equal( a.member(2),
           true,
           "1 is in a" );
    
    equal( a.member(42),
           false,
           "42 is not in a" );
  });
  
  
  test("Set.isSubset", function () {
    var a = new Set(),
        b = new Set(1, 2, 3);
    
    equal( a.isSubset(new Set()),
           true,
           "Empty set is a subset of the empty set" );
    
    equal( a.isSubset(b),
           true,
           "Empty set is a subset of a populated set" );
    
    equal( b.isSubset(new Set(1, 2, 3, 4, 5)),
           true,
           "The set [1, 2, 3] is a subset of the set [1, 2, 3, 4, 5]" );
    
    equal( b.isSubset(a),
           false,
           "The set [1, 2, 3] is not a subset of the empty set" );
    
    equal( b.isSubset(new Set(2, 3, 4)),
           false,
           "The set [1, 2, 3] is not a subset of the set [2, 3, 4]" );
  });
  
  
  test("Set.isSuperset", function () {
    var a = new Set(),
        b = new Set(1, 2, 3);
    
    equal( a.isSuperset(new Set()),
           true,
           "Empty set is a superset of the empty set" );
    
    equal( b.isSuperset(a),
           true,
           "A populated set is a superset of the empty set" );
    
    equal( b.isSuperset(new Set(1, 2, 3)),
           true,
           "The set [1, 2, 3] is a superset of the set [1, 2, 3]" );
    
    equal( b.isSuperset(new Set(1, 2)),
           true,
           "The set [1, 2, 3] is a superset of the set [1, 2]" );
    
    equal( a.isSuperset(b),
           false,
           "The empty set is not a superset of the set [1, 2, 3]" );
    
    equal( b.isSuperset(new Set(2, 3, 4)),
           false,
           "The set [1, 2, 3] is not a superset of the set [2, 3, 4]" );
  });

  
  
});
