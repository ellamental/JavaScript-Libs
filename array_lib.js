//___________________________________________________________________________//
// array_lib
//
// array_lib is a collection of array functions
//
// Copyright (c) 2011, Nick Zarczynski
// All rights reserved.
// License: BSD 3-Clause
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//  * Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
//  * Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
//  * Neither the name of Nick Zarczynski nor the names of its
//    contributors may be used to endorse or promote products derived from
//    this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
// IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
// TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
// PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//___________________________________________________________________________//

// Putting the "use strict" statement here will affect all other files that
// are concatenated with this code.  If this file is concatenated with other
// files and they suddenly start breaking, comment this out.  For me this is
// preferable to adding "use strict" to every function definition in this file.
"use strict";


var array_lib = (function () {
  
  var a = {};
  
  
  //________________________________________________________________________//
  // Private Methods
  //________________________________________________________________________//
  
  function shortest_array(args) {
    var shortest = args[0].length,
        i;
    for (i=0, j=args.length; i < j; i++) {
      if (args[i].length < shortest) {
        shortest = args[i].length;
      }
    }
    return shortest;
  }
  
  
  //________________________________________________________________________//
  // Equality
  //________________________________________________________________________//
  
  a.is_equal = function (a, b, eq) {
    // General array equality, eq is an optional function that accepts 2
    // arguments and returns a boolean value (defaults to ===).
    eq = (typeof eq === 'undefined') ? function (x, y) { return x === y; } : eq;
    if (a instanceof Array && b instanceof Array) {
      if (a.length === b.length) {
        for (var i=0,j=a.length; i < j; i++) {
          if (!array_lib.is_equal(a[i], b[i], eq)) {
            return false;
          }
        }
        return true;
      }
      return false;
    }
    else {
      return eq(a, b);
    }
  };
  
  
  //________________________________________________________________________//
  // map, fold, reduce, etc
  //________________________________________________________________________//
  
  a.map = function (fn /* array_1 ... array_n */) {
    // Returns a new array that is the result of applying fn to each element of
    // array.  fn is a function taking as many arguments as there are array
    // arguments and returning a single value.
    var out = [],
        args = Array.prototype.slice.call(arguments, 1),
        num_args = args.length,
        length = shortest_array(args),
        values, i, j;
    for (i=0; i < length; i++) {
      values = [];
      for (j=0; j < num_args; j++) {
        values.push(args[j][i]);
      }
      out.push(fn.apply(fn, values));
    }
    return out;
  };
  
  a.map$ = function (fn /* array_1 ... array_n */) {
    // Returns a new array that is the result of applying fn to each element of
    // array.  fn is a function taking as many arguments as there are array
    // arguments and returning a single value.
    var args = Array.prototype.slice.call(arguments, 1),
        num_args = args.length,
        out = args[0],
        length = shortest_array(args),
        values, i, j;
    for (i=0; i < length; i++) {
      values = [];
      for (j=0; j < num_args; j++) {
        values.push(args[j][i]);
      }
      out[i] = fn.apply(fn, values);
    }
    return out;
  };
  
  
  //________________________________________________________________________//
  // filtering and partitioning
  //________________________________________________________________________//
  
  a.filter = function (pred, array) {
    // Return a new array consisting of all the elements for which
    // pred(element) returns true.
    var out = [];
    for (var i=0, j=array.length; i < j; i++) {
      if (pred(array[i])) {
        out.push(array[i]);
      }
    }
    return out;
  };
  
  a.filter$ = function (pred, array) {
    // Like filter, except filter$ is allowed, but not required, to
    // destructively update array.
    for (var i=array.length-1; i >= 0; i--) {
      if (!pred(array[i])) {
        array.splice(i, 1);
      }
    }
    return array;
  };
  
  a.remove = function (pred, array, count) {
    // Remove count elements for which pred(element) returns true and return
    // a newly allocated array.  If count is not provided all elements
    // for which pred(element) returns true will be removed.
    var temp = [],
        i, j;
    if (typeof count === 'undefined') {
      for (i=0, j=array.length; i < j; i++) {
        if (!pred(array[i])) {
          temp.push(array[i]);
        }
      }
    }
    else {
      for (i=0, j=array.length; i < j; i++) {
        if (count > 0) {
          if (!pred(array[i])) {
            temp.push(array[i]);
          }
          else {
            count -= 1;
          }
        }
        else {
          temp.push(array[i]);
        }
      }
    }
    return temp;
  };
  
  a.remove$ = function (pred, array, count) {
    // Like remove except remove$ is allowed, but not required, to
    // destructively update array.
    var indicies_to_remove = [],
        i;
    if (typeof count === 'undefined') {
      for (i=0, j=array.length; i < j; i++) {
        if (pred(array[i])) {
          array.splice(i, 1);
          j -= 1;
          i -= 1;
          count -= 1;
        }
      }
    }
    else {
      for (i=0, j=array.length; i < j; i++) {
        if (count > 0) {
          if (pred(array[i])) {
            array.splice(i, 1);
            j -= 1;
            i -= 1;
            count -= 1;
          }
        }
        else {
          return array;
        }
      }
    }
    return array;
  };
  
  a.partition = function (pred, array) {
    // Returns an array consisting of two arrays, one containing elements for
    // which pred(element) returns true (return[0]) and one with elements for
    // which pred(element) returns false (return[1]).
    var temp_in = [],
        temp_out = [],
        i, j;
    for (i=0, j=array.length; i < j; i++) {
      if (pred(array[i])) {
        temp_in.push(array[i]);
      }
      else {
        temp_out.push(array[i]);
      }
    }
    return [temp_in, temp_out];
  };
  
  a.partition$ = function (pred, array) {
    // Like partition except partition$ is allowed, but not required, to
    // destructively update array to produce a result.
    var temp_out = [],
        i, j;
    for (i=0, j=array.length; i < j; i++) {
      if (!pred(array[i])) {
        temp_out.push(array[i]);
        array.splice(i, 1);
        i -= 1;
        j -= 1;
      }
    }
    return [array, temp_out];
  };
  
  
  //________________________________________________________________________//
  // Searching
  //________________________________________________________________________//
  
  a.index = function (pred /* array_1 ... array_n */ ) {
    // Return the index of the left-most element for which
    // pred(array_0[i], ..., array[n][i]) returns true.
    var args = Array.prototype.slice.call(arguments, 1),
        num_args = args.length,
        length = shortest_array(args),
        count = 0;
        values, i, j;
    for (i=0; i < length; i++) {
      values = [];
      for (j=0; j < num_args; j++) {
        values.push(args[j][i]);
      }
      if (pred.apply(pred, values)) {
        return count;
      }
      count += 1;
    }
    return -1;
  };
  
  
  //________________________________________________________________________//
  // Return the array_lib object
  //________________________________________________________________________//
  
  return a;
})();






//__________________________________________________________________________//
// Tests
//__________________________________________________________________________//

(function () {
  var a = array_lib,
      counter, current_method;
    
  function t(expr, expected) {
    if (!a.is_equal(expr, expected)) {
      console.log("Test Failed! "+current_method+": #"+counter);
    }
    counter++;
  }
  
  
  //________________________________________________________________________//
  // is_equal
  //________________________________________________________________________//
  
  current_method = "is_equal"
  counter = 0;
  
  // 0 - empty arrays
  t(a.is_equal([], []),
    true);
  
  // 2
  t(a.is_equal([1, 2, 3], [1, 2, 3]),
    true);
  
  // 3 - nested arrays
  t(a.is_equal([1, [2, 3]], [1, [2, 3]]),
    true);
  
  // 4 - eq function
  t(a.is_equal([1, 2, 3], [2, 3, 4], function (x, y) { return x === y-1; }),
    true);
  
  // not equal
  
  // 5 - different length
  t(a.is_equal([1, 2], [1, 2, 3]),
    false);
  
  // 6 - different elements
  t(a.is_equal([1, 2], [2, 1]),
    false);
  
  // 7 - nested arrays
  t(a.is_equal([1, [2, 3]], [1, [2, 4]]),
    false);
  
  // 8 - eq function
  t(a.is_equal([1, 2, 3], [1, 2, 3], function (x, y) { return x === y-1; }),
    false);
  
  
  //________________________________________________________________________//
  // map
  //________________________________________________________________________//
  
  current_method = "map"
  counter = 0;
  
  // 0
  t(a.map(function (x) { return x+1; }, [0, 1, 2]),
    [1, 2, 3]);
  
  // 1 - multiple lists
  t(a.map(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5]),
    [3, 5, 7]);
  
  // 2 - unequal length lists 1st is longest
  t(a.map(function (x, y) { return x+y; }, [0, 1, 2, 10], [3, 4, 5]),
    [3, 5, 7]);

  // 3 - unequal length lists 2nd is longest
  t(a.map(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5, 10]),
    [3, 5, 7]);
  
  
  //________________________________________________________________________//
  // map$
  //________________________________________________________________________//
  
  current_method = "map$"
  counter = 0;
  
  // 0
  t(a.map$(function (x) { return x+1; }, [0, 1, 2]),
    [1, 2, 3]);
  
  // 1 - multiple lists
  t(a.map$(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5]),
    [3, 5, 7]);
  
  // 2 - unequal length lists 1st is longest
  t(a.map$(function (x, y) { return x+y; }, [0, 1, 2, 10], [3, 4, 5]),
    [3, 5, 7, 10]);

  // 3 - unequal length lists 2nd is longest
  t(a.map$(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5, 10]),
    [3, 5, 7]);
  
  
  //________________________________________________________________________//
  // filter
  //________________________________________________________________________//
  
  current_method = "filter"
  counter = 0;
  
  // 0
  t(a.filter(function (x) { return x < 3; }, [1, 2, 3, 4]),
    [1, 2]);
  
  
  //________________________________________________________________________//
  // filter$
  //________________________________________________________________________//
  
  current_method = "filter$"
  counter = 0;
  
  // 0
  t(a.filter$(function (x) { return x < 3; }, [1, 2, 3, 4]),
    [1, 2]);
  
  
  //________________________________________________________________________//
  // remove
  //________________________________________________________________________//
  
  current_method = "remove"
  counter = 0;
  
  // 0 - Remove single element
  t(a.remove(function (x) { return x === 2; }, [1, 2, 3, 4]),
    [1, 3, 4]);
  
  // 1 - Remove all less than 3
  t(a.remove(function (x) { return x < 3; }, [1, 3, 2, 4]),
    [3, 4]);
  
  // 2 - Remove only 2 elements less than 5
  t(a.remove(function (x) { return x < 5; }, [1, 2, 3, 4, 5, 6, 7], 2),
    [3, 4, 5, 6, 7]);
  
  
  //________________________________________________________________________//
  // remove$
  //________________________________________________________________________//
  
  current_method = "remove$"
  counter = 0;
  
  // 0 - Remove single element
  t(a.remove$(function (x) { return x === 2; }, [1, 2, 3, 4]),
    [1, 3, 4]);
  
  // 1 - Remove all less than 3
  t(a.remove$(function (x) { return x < 3; }, [1, 3, 2, 4]),
    [3, 4]);
  
  // 2 - Remove only 2 elements less than 5
  t(a.remove$(function (x) { return x < 5; }, [1, 2, 3, 4, 5, 6, 7], 2),
    [3, 4, 5, 6, 7]);
  
  
  //________________________________________________________________________//
  // partition
  //________________________________________________________________________//
  
  current_method = "partition"
  counter = 0;
  
  // 0 - less than 3
  t(a.partition(function (x) { return x < 3; }, [1, 3, 2, 4]),
    [[1, 2], [3, 4]]);
  
  
  //________________________________________________________________________//
  // partition$
  //________________________________________________________________________//
  
  current_method = "partition$"
  counter = 0;
  
  // 0 - less than 3
  t(a.partition$(function (x) { return x < 3; }, [1, 3, 2, 4]),
    [[1, 2], [3, 4]]);
  
  
  //________________________________________________________________________//
  // index
  //________________________________________________________________________//
  
  current_method = "index"
  counter = 0;
  
  // 0 - in array
  t(a.index(function (x) { return x === 2; }, [1, 2, 3]),
    1);
  
  // 1 - not in array
  t(a.index(function (x) { return x === 42; }, [1, 2, 3]),
    -1);
  
  // 2 - in multiple arrays
  t(a.index(function (x, y) { return x > y; }, [1, 2, 3], [3, 2, 1]),
    2);
  
  // 3 - not in multiple arrays
  t(a.index(function (x, y) { return x > y; }, [1, 2, 3], [10, 20, 30]),
    -1);
  
  
  
  
  
  
  
  
  
  
  //________________________________________________________________________//
  // Finish tests and display # of functions implemented
  //________________________________________________________________________//
  
  console.log("Tests completed!");
  counter = 0;
  for(var i in array_lib) {
    if (array_lib.hasOwnProperty(i)) {
      counter += 1;
    }
  }
  return counter + " functions implemented";
})();
