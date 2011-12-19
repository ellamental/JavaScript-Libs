$(document).ready(function(){
  module("array.js");
  
  test("is_equal", function () {
    
    ok( array_lib.is_equal([], []),
        "Empty arrays compare equal" );
    
    ok( array_lib.is_equal([1, 2, 3], [1, 2, 3]),
        "Equal length && === elements compare equal" );
    
    ok( array_lib.is_equal([1, [2, 3]], [1, [2, 3]]),
        "Nested arrays" );
    
    ok( array_lib.is_equal([1, 2, 3], [2, 3, 4], function (x, y) { return x === y-1; }), 
        "With custom eq function" );
    
    equal( array_lib.is_equal([1, 2], [1, 2, 3]),
           false,
           "Unequal length" );
    
    equal( array_lib.is_equal([1, 2], [2, 1]),
           false,
           "different elements" );
    
    equal( array_lib.is_equal([1, [2, 3]], [1, [2, 4]]),
           false,
           "different nested arrays" );
    
    equal( array_lib.is_equal([1, 2, 3], [1, 2, 3], function (x, y) { return x === y-1; }),
           false, 
           "unequal as defined by the supplied eq function" );
  });
  
  
  test("map", function () {
    deepEqual( array_lib.map(function (x) { return x+1; }, [0, 1, 2]),
               [1, 2, 3],
               "Add 1 to each element" );
    
    deepEqual( array_lib.map(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5]),
               [3, 5, 7],
               "Add each element from 2 arrays" );
    
    deepEqual( array_lib.map(function (x, y) { return x+y; }, [0, 1, 2, 10], [3, 4, 5]),
               [3, 5, 7],
               "Unequal length lists 1st is longest" );

    deepEqual( array_lib.map(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5, 10]),
               [3, 5, 7],
               "Unequal length lists 2nd is longest" );
  });
  
  
  test("map$", function () {
    deepEqual( array_lib.map$(function (x) { return x+1; }, [0, 1, 2]),
               [1, 2, 3],
               "Add 1 to each element" );
    
    deepEqual( array_lib.map$(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5]),
               [3, 5, 7],
               "Add each element from 2 arrays" );
    
    deepEqual( array_lib.map$(function (x, y) { return x+y; }, [0, 1, 2, 10], [3, 4, 5]),
               [3, 5, 7, 10],
               "Unequal length lists 1st is longest" );

    deepEqual( array_lib.map$(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5, 10]),
               [3, 5, 7],
               "Unequal length lists 2nd is longest" );
  });
  
  
  test("filter", function () {
    deepEqual( array_lib.filter(function (x) { return x < 3; }, [1, 2, 3, 4]),
               [1, 2],
               "New array consisting of all elements < 3" );
  });
  
  
  test("filter$", function () {
    deepEqual( array_lib.filter$(function (x) { return x < 3; }, [1, 2, 3, 4]),
               [1, 2],
               "Array consisting of all elements less than 3" );
  });
  
  
  test("remove", function () {
    deepEqual( array_lib.remove(function (x) { return x === 2; }, [1, 2, 3, 4]),
               [1, 3, 4],
               "Remove single element" );
    
    deepEqual( array_lib.remove(function (x) { return x < 3; }, [1, 3, 2, 4]),
               [3, 4],
               "Remove all less than 3" );
    
    deepEqual( array_lib.remove(function (x) { return x < 5; }, [1, 2, 3, 4, 5, 6, 7], 2),
               [3, 4, 5, 6, 7],
               "Remove only 2 elements less than 5" );
  });


  test("remove$", function () {
    deepEqual( array_lib.remove$(function (x) { return x === 2; }, [1, 2, 3, 4]),
               [1, 3, 4],
               "Remove single element" );
    
    deepEqual( array_lib.remove$(function (x) { return x < 3; }, [1, 3, 2, 4]),
               [3, 4],
               "Remove all less than 3" );
    
    deepEqual( array_lib.remove$(function (x) { return x < 5; }, [1, 2, 3, 4, 5, 6, 7], 2),
               [3, 4, 5, 6, 7],
               "Remove only 2 elements less than 5" );
  });


  test("partition", function () {
    deepEqual( array_lib.partition(function (x) { return x < 3; }, [1, 3, 2, 4]),
               [[1, 2], [3, 4]],
               "Return 2 arrays: 1st containing elements < 3, 2nd containing elements >= 3" );
  });


  test("partition$", function () {
    deepEqual( array_lib.partition$(function (x) { return x < 3; }, [1, 3, 2, 4]),
               [[1, 2], [3, 4]],
               "Return 2 arrays: 1st containing elements < 3, 2nd containing elements >= 3" );
  });


  test("index", function () {
    equal( array_lib.index(function (x) { return x === 2; }, [1, 2, 3]),
           1,
           "2 in array" );
    
    equal( array_lib.index(function (x) { return x === 42; }, [1, 2, 3]),
           -1,
           "42 not in array" );
    
    equal( array_lib.index(function (x, y) { return x > y; }, [1, 2, 3], [3, 2, 1]),
           2,
           "in multiple arrays" );
    
    equal( array_lib.index(function (x, y) { return x > y; }, [1, 2, 3], [10, 20, 30]),
           -1,
           "not in multiple arrays" );
  });


  test("indexOf", function () {
    equal( array_lib.indexOf(2, [1, 2, 3]),
           1,
           "2 in array" );
    
    equal( array_lib.indexOf(42, [1, 2, 3]),
           -1,
           "42 not in array" );
    
    equal( array_lib.indexOf(42, [0, 42, 7, 35, 42, 64], 2),
           4,
           "42 in array with optional start argument" );
    
    equal( array_lib.indexOf(42, [42, 35, 7, 0], 1),
           -1,
           "42 not in array with optional start argument" );
  });


  test("find", function () {
    equal( array_lib.find(function (x) { return x % 2 === 0; }, [1, 3, 4, 5]),
           4,
           "find even number" );
    
    equal( array_lib.find(function (x) { return x % 2 === 0; }, [1, 3, 5]),
           false,
           "find with element not in array" );
  });


  test("any", function () {
    equal( array_lib.any(function (x) { return x % 2 === 0; }, [1, 3, 4]),
           true,
           "any even" );
    
    equal( array_lib.any(function (x) { return x % 2 === 0; }, [1, 3, 5]),
           false,
           "any even (not in array)" );
    
    equal( array_lib.any(function (x, y) { return x > y; }, [1, 2, 3], [3, 2, 1]),
           true,
           "any element in array1[i] greater than element in array2[i]" );
    
    equal( array_lib.any(function (x, y) { return x > y; }, [1, 2, 3], [10, 11, 12]),
           false,
           "any element in array1[i] greater than element in array2[i] (false)" );
  });


  test("every", function () {
    equal( array_lib.every(function (x) { return x % 2 === 0; }, [2, 4, 6]),
           true,
           "every even" );
    
    equal( array_lib.every(function (x) { return x % 2 === 0; }, [2, 4, 5]),
           false,
           "every even (false)" );
    
    equal( array_lib.every(function (x, y) { return x > y; }, [10, 11, 12], [1, 2, 3]),
           true,
           "every element in array1[i] greater than element in array2[i]" );
    
    equal( array_lib.every(function (x, y) { return x > y; }, [3, 2, 1], [1, 2, 3]),
           false,
           "every element in array1[i] greater than element in array2[i] (false)" );
  });
  
  
  
});
