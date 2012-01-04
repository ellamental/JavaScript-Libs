$(document).ready(function(){
  var a = array;
  
  module("array.js");
  
  test("is_equal", function () {
    
    ok( a.is_equal([], []),
        "Empty arrays compare equal" );
    
    ok( a.is_equal([1, 2, 3], [1, 2, 3]),
        "Equal length && === elements compare equal" );
    
    ok( a.is_equal([1, [2, 3]], [1, [2, 3]]),
        "Nested arrays" );
    
    ok( a.is_equal([1, 2, 3], [2, 3, 4], function (x, y) { return x === y-1; }), 
        "With custom eq function" );
    
    equal( a.is_equal([1, 2], [1, 2, 3]),
           false,
           "Unequal length" );
    
    equal( a.is_equal([1, 2], [2, 1]),
           false,
           "different elements" );
    
    equal( a.is_equal([1, [2, 3]], [1, [2, 4]]),
           false,
           "different nested arrays" );
    
    equal( a.is_equal([1, 2, 3], [1, 2, 3], function (x, y) { return x === y-1; }),
           false, 
           "unequal as defined by the supplied eq function" );
  });
  
  
  test("is_array", function () {
    equal( a.is_array([]),
           true,
           "Empty array literal is an array" );
    
    equal( a.is_array([1, 2]),
           true,
           "array literal is array" );
    
    equal( a.is_array( new Array() ),
           true,
           "Array object is array" );
  });
  
  
  
  //________________________________________________________________________//
  // Constructors
  //________________________________________________________________________//
  
  test("tabulate", function () {
    deepEqual( a.tabulate(3, function (i) { return i+1; }),
               [1, 2, 3],
               "create an array with 3 elements by adding 1 to each index" );
  });
  
  
  test("make_array", function () {
    deepEqual( a.make_array(3, "a"),
               ["a", "a", "a"],
               "create a 3 element array filled with 'a'" );
  });
  
  
  test("iota", function () {
    deepEqual( a.iota(3),
               [0, 1, 2],
               "single argument" );
    
    deepEqual( a.iota(3, 3),
               [3, 4, 5],
               "count and start arguments" );
    
    deepEqual( a.iota(3, 4, 2),
               [4, 6, 8],
               "count, start and step arguments" );
  });
               
  
  test("range", function () {
    deepEqual( a.range(3),
               [0, 1, 2],
               "single argument" );
    
    deepEqual( a.range(3, 6),
               [3, 4, 5],
               "start and stop arguments" );
    
    deepEqual( a.range(4, 8, 2),
               [4, 6],
               "start, stop and step arguments" );
  });
  
  
  
  //________________________________________________________________________//
  // Selectors
  //________________________________________________________________________//
  
  test("take", function () {
    var arr = [0, 1, 2, 3, 4, 5];
    
    deepEqual( a.take(arr, 2),
               [0, 1],
               "Return a new array with the first 2 elements" );
  });
  
  
  test("drop", function () {
    var arr = [0, 1, 2, 3, 4, 5];
    
    deepEqual( a.drop(arr, 2),
               [2, 3, 4, 5],
               "Return a new array with all but the first 2 elements" );
  });
  
  
  test("split_at", function () {
    var arr = [0, 1, 2, 3, 4, 5];
    
    deepEqual( a.split_at(arr, 2),
               [[0, 1], [2, 3, 4, 5]],
               "Equivalent to [take(arr, 2), drop(arr, 2)]" );
  });
  
  
  
  //________________________________________________________________________//
  // map, fold, reduce, etc
  //________________________________________________________________________//
  
  test("map", function () {
    deepEqual( a.map(function (x) { return x+1; }, [0, 1, 2]),
               [1, 2, 3],
               "Add 1 to each element" );
    
    deepEqual( a.map(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5]),
               [3, 5, 7],
               "Add each element from 2 arrays" );
    
    deepEqual( a.map(function (x, y) { return x+y; }, [0, 1, 2, 10], [3, 4, 5]),
               [3, 5, 7],
               "Unequal length lists 1st is longest" );

    deepEqual( a.map(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5, 10]),
               [3, 5, 7],
               "Unequal length lists 2nd is longest" );
  });
  
  
  test("map$", function () {
    deepEqual( a.map$(function (x) { return x+1; }, [0, 1, 2]),
               [1, 2, 3],
               "Add 1 to each element" );
    
    deepEqual( a.map$(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5]),
               [3, 5, 7],
               "Add each element from 2 arrays" );
    
    deepEqual( a.map$(function (x, y) { return x+y; }, [0, 1, 2, 10], [3, 4, 5]),
               [3, 5, 7, 10],
               "Unequal length lists 1st is longest" );

    deepEqual( a.map$(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5, 10]),
               [3, 5, 7],
               "Unequal length lists 2nd is longest" );
  });
  
  
  
  //________________________________________________________________________//
  // filtering and partitioning
  //________________________________________________________________________//
  
  test("filter", function () {
    deepEqual( a.filter(function (x) { return x < 3; }, [1, 2, 3, 4]),
               [1, 2],
               "New array consisting of all elements < 3" );
  });
  
  
  test("filter$", function () {
    deepEqual( a.filter$(function (x) { return x < 3; }, [1, 2, 3, 4]),
               [1, 2],
               "Array consisting of all elements less than 3" );
  });
  
  
  test("remove", function () {
    deepEqual( a.remove(function (x) { return x === 2; }, [1, 2, 3, 4]),
               [1, 3, 4],
               "Remove single element" );
    
    deepEqual( a.remove(function (x) { return x < 3; }, [1, 3, 2, 4]),
               [3, 4],
               "Remove all less than 3" );
    
    deepEqual( a.remove(function (x) { return x < 5; }, [1, 2, 3, 4, 5, 6, 7], 2),
               [3, 4, 5, 6, 7],
               "Remove only 2 elements less than 5" );
  });


  test("remove$", function () {
    deepEqual( a.remove$(function (x) { return x === 2; }, [1, 2, 3, 4]),
               [1, 3, 4],
               "Remove single element" );
    
    deepEqual( a.remove$(function (x) { return x < 3; }, [1, 3, 2, 4]),
               [3, 4],
               "Remove all less than 3" );
    
    deepEqual( a.remove$(function (x) { return x < 5; }, [1, 2, 3, 4, 5, 6, 7], 2),
               [3, 4, 5, 6, 7],
               "Remove only 2 elements less than 5" );
  });


  test("partition", function () {
    deepEqual( a.partition(function (x) { return x < 3; }, [1, 3, 2, 4]),
               [[1, 2], [3, 4]],
               "Return 2 arrays: 1st containing elements < 3, 2nd containing elements >= 3" );
  });


  test("partition$", function () {
    deepEqual( a.partition$(function (x) { return x < 3; }, [1, 3, 2, 4]),
               [[1, 2], [3, 4]],
               "Return 2 arrays: 1st containing elements < 3, 2nd containing elements >= 3" );
  });

  
  
  //________________________________________________________________________//
  // Searching
  //________________________________________________________________________//
  
  test("index", function () {
    equal( a.index(function (x) { return x === 2; }, [1, 2, 3]),
           1,
           "2 in array" );
    
    equal( a.index(function (x) { return x === 42; }, [1, 2, 3]),
           -1,
           "42 not in array" );
    
    equal( a.index(function (x, y) { return x > y; }, [1, 2, 3], [3, 2, 1]),
           2,
           "in multiple arrays" );
    
    equal( a.index(function (x, y) { return x > y; }, [1, 2, 3], [10, 20, 30]),
           -1,
           "not in multiple arrays" );
  });


  test("indexOf", function () {
    equal( a.indexOf(2, [1, 2, 3]),
           1,
           "2 in array" );
    
    equal( a.indexOf(42, [1, 2, 3]),
           -1,
           "42 not in array" );
    
    equal( a.indexOf(42, [0, 42, 7, 35, 42, 64], 2),
           4,
           "42 in array with optional start argument" );
    
    equal( a.indexOf(42, [42, 35, 7, 0], 1),
           -1,
           "42 not in array with optional start argument" );
  });


  test("find", function () {
    equal( a.find(function (x) { return x % 2 === 0; }, [1, 3, 4, 5]),
           4,
           "find even number" );
    
    equal( a.find(function (x) { return x % 2 === 0; }, [1, 3, 5]),
           false,
           "find with element not in array" );
  });


  test("any", function () {
    equal( a.any(function (x) { return x % 2 === 0; }, [1, 3, 4]),
           true,
           "any even" );
    
    equal( a.any(function (x) { return x % 2 === 0; }, [1, 3, 5]),
           false,
           "any even (not in array)" );
    
    equal( a.any(function (x, y) { return x > y; }, [1, 2, 3], [3, 2, 1]),
           true,
           "any element in array1[i] greater than element in array2[i]" );
    
    equal( a.any(function (x, y) { return x > y; }, [1, 2, 3], [10, 11, 12]),
           false,
           "any element in array1[i] greater than element in array2[i] (false)" );
  });


  test("every", function () {
    equal( a.every(function (x) { return x % 2 === 0; }, [2, 4, 6]),
           true,
           "every even" );
    
    equal( a.every(function (x) { return x % 2 === 0; }, [2, 4, 5]),
           false,
           "every even (false)" );
    
    equal( a.every(function (x, y) { return x > y; }, [10, 11, 12], [1, 2, 3]),
           true,
           "every element in array1[i] greater than element in array2[i]" );
    
    equal( a.every(function (x, y) { return x > y; }, [3, 2, 1], [1, 2, 3]),
           false,
           "every element in array1[i] greater than element in array2[i] (false)" );
  });
  
  
  
  //________________________________________________________________________//
  // Misc
  //________________________________________________________________________//
  
  test("copy", function () {
    deepEqual( a.copy([1, 2, 3]),
               [1, 2, 3],
               "copy an array" );
  });
  
  
  test("swap", function () {
    var arr = [1, 2, 3, 4];
    
    deepEqual( a.swap(arr, 1, 3),
               [1, 4, 3, 2],
               "swap the 2nd and 4th elements" );
    
    deepEqual( arr,
               [1, 2, 3, 4],
               "ensure the original array is unchanged" );
  });
  
  
  test("swap$", function () {
    var arr = [1, 2, 3, 4];
    
    deepEqual( a.swap(arr, 1, 3),
               [1, 4, 3, 2],
               "swap the 2nd and 4th elements" );
  });
  
  
  test("insert$", function () {
    var arr = [1, 2, 3, 4];
    
    deepEqual( a.insert$(arr, 2, 42),
               [1, 2, 42, 3, 4],
               "insert 42 at the 2nd index" );
  })
  
  
  test("pop$", function () {
    var arr = [1, 2, 3, 4, 5];
    
    deepEqual( a.pop$(arr),
               5,
               "remove and return last element" );
    
    deepEqual( arr,
               [1, 2, 3, 4],
               "arr should be modified to have 4 removed" );
    
    deepEqual( a.pop$(arr, 1),
               2,
               "remove and return from arbitrary index" );
    
    deepEqual( arr,
               [1, 3, 4],
               "arr should now be [1, 3, 4]" );
  });
  
  
});
