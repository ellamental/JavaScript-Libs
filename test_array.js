$(document).ready(function(){
  module("array.js");
  
  test("is_equal", function () {
    
    ok( array.is_equal([], []),
        "Empty arrays compare equal" );
    
    ok( array.is_equal([1, 2, 3], [1, 2, 3]),
        "Equal length && === elements compare equal" );
    
    ok( array.is_equal([1, [2, 3]], [1, [2, 3]]),
        "Nested arrays" );
    
    ok( array.is_equal([1, 2, 3], [2, 3, 4], function (x, y) { return x === y-1; }), 
        "With custom eq function" );
    
    equal( array.is_equal([1, 2], [1, 2, 3]),
           false,
           "Unequal length" );
    
    equal( array.is_equal([1, 2], [2, 1]),
           false,
           "different elements" );
    
    equal( array.is_equal([1, [2, 3]], [1, [2, 4]]),
           false,
           "different nested arrays" );
    
    equal( array.is_equal([1, 2, 3], [1, 2, 3], function (x, y) { return x === y-1; }),
           false, 
           "unequal as defined by the supplied eq function" );
  });
  
  
  test("is_array", function () {
    equal( array.is_array([]),
           true,
           "Empty array literal is an array" );
    
    equal( array.is_array([1, 2]),
           true,
           "array literal is array" );
    
    equal( array.is_array( new Array() ),
           true,
           "Array object is array" );
  });
  
  
  
  //________________________________________________________________________//
  // map, fold, reduce, etc
  //________________________________________________________________________//
  
  test("map", function () {
    deepEqual( array.map(function (x) { return x+1; }, [0, 1, 2]),
               [1, 2, 3],
               "Add 1 to each element" );
    
    deepEqual( array.map(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5]),
               [3, 5, 7],
               "Add each element from 2 arrays" );
    
    deepEqual( array.map(function (x, y) { return x+y; }, [0, 1, 2, 10], [3, 4, 5]),
               [3, 5, 7],
               "Unequal length lists 1st is longest" );

    deepEqual( array.map(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5, 10]),
               [3, 5, 7],
               "Unequal length lists 2nd is longest" );
  });
  
  
  test("map$", function () {
    deepEqual( array.map$(function (x) { return x+1; }, [0, 1, 2]),
               [1, 2, 3],
               "Add 1 to each element" );
    
    deepEqual( array.map$(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5]),
               [3, 5, 7],
               "Add each element from 2 arrays" );
    
    deepEqual( array.map$(function (x, y) { return x+y; }, [0, 1, 2, 10], [3, 4, 5]),
               [3, 5, 7, 10],
               "Unequal length lists 1st is longest" );

    deepEqual( array.map$(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5, 10]),
               [3, 5, 7],
               "Unequal length lists 2nd is longest" );
  });
  
  
  
  //________________________________________________________________________//
  // filtering and partitioning
  //________________________________________________________________________//
  
  test("filter", function () {
    deepEqual( array.filter(function (x) { return x < 3; }, [1, 2, 3, 4]),
               [1, 2],
               "New array consisting of all elements < 3" );
  });
  
  
  test("filter$", function () {
    deepEqual( array.filter$(function (x) { return x < 3; }, [1, 2, 3, 4]),
               [1, 2],
               "Array consisting of all elements less than 3" );
  });
  
  
  test("remove", function () {
    deepEqual( array.remove(function (x) { return x === 2; }, [1, 2, 3, 4]),
               [1, 3, 4],
               "Remove single element" );
    
    deepEqual( array.remove(function (x) { return x < 3; }, [1, 3, 2, 4]),
               [3, 4],
               "Remove all less than 3" );
    
    deepEqual( array.remove(function (x) { return x < 5; }, [1, 2, 3, 4, 5, 6, 7], 2),
               [3, 4, 5, 6, 7],
               "Remove only 2 elements less than 5" );
  });


  test("remove$", function () {
    deepEqual( array.remove$(function (x) { return x === 2; }, [1, 2, 3, 4]),
               [1, 3, 4],
               "Remove single element" );
    
    deepEqual( array.remove$(function (x) { return x < 3; }, [1, 3, 2, 4]),
               [3, 4],
               "Remove all less than 3" );
    
    deepEqual( array.remove$(function (x) { return x < 5; }, [1, 2, 3, 4, 5, 6, 7], 2),
               [3, 4, 5, 6, 7],
               "Remove only 2 elements less than 5" );
  });


  test("partition", function () {
    deepEqual( array.partition(function (x) { return x < 3; }, [1, 3, 2, 4]),
               [[1, 2], [3, 4]],
               "Return 2 arrays: 1st containing elements < 3, 2nd containing elements >= 3" );
  });


  test("partition$", function () {
    deepEqual( array.partition$(function (x) { return x < 3; }, [1, 3, 2, 4]),
               [[1, 2], [3, 4]],
               "Return 2 arrays: 1st containing elements < 3, 2nd containing elements >= 3" );
  });

  
  
  //________________________________________________________________________//
  // Searching
  //________________________________________________________________________//
  
  test("index", function () {
    equal( array.index(function (x) { return x === 2; }, [1, 2, 3]),
           1,
           "2 in array" );
    
    equal( array.index(function (x) { return x === 42; }, [1, 2, 3]),
           -1,
           "42 not in array" );
    
    equal( array.index(function (x, y) { return x > y; }, [1, 2, 3], [3, 2, 1]),
           2,
           "in multiple arrays" );
    
    equal( array.index(function (x, y) { return x > y; }, [1, 2, 3], [10, 20, 30]),
           -1,
           "not in multiple arrays" );
  });


  test("indexOf", function () {
    equal( array.indexOf(2, [1, 2, 3]),
           1,
           "2 in array" );
    
    equal( array.indexOf(42, [1, 2, 3]),
           -1,
           "42 not in array" );
    
    equal( array.indexOf(42, [0, 42, 7, 35, 42, 64], 2),
           4,
           "42 in array with optional start argument" );
    
    equal( array.indexOf(42, [42, 35, 7, 0], 1),
           -1,
           "42 not in array with optional start argument" );
  });


  test("find", function () {
    equal( array.find(function (x) { return x % 2 === 0; }, [1, 3, 4, 5]),
           4,
           "find even number" );
    
    equal( array.find(function (x) { return x % 2 === 0; }, [1, 3, 5]),
           false,
           "find with element not in array" );
  });


  test("any", function () {
    equal( array.any(function (x) { return x % 2 === 0; }, [1, 3, 4]),
           true,
           "any even" );
    
    equal( array.any(function (x) { return x % 2 === 0; }, [1, 3, 5]),
           false,
           "any even (not in array)" );
    
    equal( array.any(function (x, y) { return x > y; }, [1, 2, 3], [3, 2, 1]),
           true,
           "any element in array1[i] greater than element in array2[i]" );
    
    equal( array.any(function (x, y) { return x > y; }, [1, 2, 3], [10, 11, 12]),
           false,
           "any element in array1[i] greater than element in array2[i] (false)" );
  });


  test("every", function () {
    equal( array.every(function (x) { return x % 2 === 0; }, [2, 4, 6]),
           true,
           "every even" );
    
    equal( array.every(function (x) { return x % 2 === 0; }, [2, 4, 5]),
           false,
           "every even (false)" );
    
    equal( array.every(function (x, y) { return x > y; }, [10, 11, 12], [1, 2, 3]),
           true,
           "every element in array1[i] greater than element in array2[i]" );
    
    equal( array.every(function (x, y) { return x > y; }, [3, 2, 1], [1, 2, 3]),
           false,
           "every element in array1[i] greater than element in array2[i] (false)" );
  });
  
  
  
  //________________________________________________________________________//
  // Misc
  //________________________________________________________________________//
  
  test("copy", function () {
    deepEqual( array.copy([1, 2, 3]),
               [1, 2, 3],
               "copy an array" );
  });
  
  
  test("swap", function () {
    var a = [1, 2, 3, 4];
    
    deepEqual( array.swap(a, 1, 3),
               [1, 4, 3, 2],
               "swap the 2nd and 4th elements" );
    
    deepEqual( a,
               [1, 2, 3, 4],
               "ensure the original array is unchanged" );
  });
  
  
  test("swap$", function () {
    var a = [1, 2, 3, 4];
    
    deepEqual( array.swap(a, 1, 3),
               [1, 4, 3, 2],
               "swap the 2nd and 4th elements" );
  });
  
  
  
  
  
});
