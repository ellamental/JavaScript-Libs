//___________________________________________________________________________//
// collections
//
// collections is a library for operations on collections (arrays and object 
// properties).
//
// collections is free software: you can redistribute it and/or
// modify it under the terms of the GNU Affero General Public
// License version 3 as published by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License version 3 for more details.
//
// You should have received a copy of the GNU Affero General Public
// License version 3 along with this program. If not, see
// <http://www.gnu.org/licenses/>.
//___________________________________________________________________________//


var collections = {
  map: function (array, fn) {
    var tmp = [];
    for (var i=0, l=array.length; i < l; i++) {
      tmp.push( fn(array[i]) );
    }
    return tmp;
  },
  
  filter: function (array, fn) {
    var tmp = [],
        t;
    for (var i=0, l=array.length; i < l; i++) {
      t = fn(array[i]);
      if (t) {
        tmp.push(array[i]);
      }
    }
    return tmp;
  },
  
  sum: function (array, selector) {
    var total = 0;
    if (typeof selector === 'undefined') {
      for (var i=0, l=array.length; i < l; i++) {
        total += array[i];
      }
    }
    else {
      for (var i=0, l=array.length; i < l; i++) {
        total += selector( array[i] );
      }
    }
    return total;
  },
  
  min: function (array, selector) {
    if (typeof selector === 'undefined') {
      return Math.min.apply( Math, array );
    }
    else {
      return Math.min.apply( Math, this.map(array, selector) );
    }
  },
  
  max: function (array, selector) {
    if (typeof selector === 'undefined') {
      return Math.max.apply( Math, array );
    }
    else {
      return Math.max.apply( Math, this.map(array, selector) );
    }
  }
};


// tests

(function () {
  var counter, current_method;
  
  function arrays_not_equal(a,b) { return a<b || b<a; }
  
  function t(expr, expected) {
    if (expected instanceof Array) {
      if (arrays_not_equal(expr, expected)) {
        console.log("Test Failed! "+current_method+": #"+counter);
      }
    }
    else {
      if (expr !== expected) {
        console.log("Test Failed! "+current_method+": #"+counter);
      }
    }
    counter++;
  }
  
  //________________________________________________________________________//
  // collections.sum
  //________________________________________________________________________//

  current_method = "map";
  counter = 0;

  // 0 - map identity function
  t(collections.map([1, 2, 3], function (x) { return x; }),
    [1, 2, 3]);
  
  // 1 - map add 2 to each element
  t(collections.map([1, 2, 3], function (x) { return x+2; }),
    [3, 4, 5]);
  
  // 2 - map add 1 over an empty array
  t(collections.map([], function (x) { return x+1; }),
    []);


  //________________________________________________________________________//
  // collections.filter
  //________________________________________________________________________//

  current_method = "filter";
  counter = 0;
  
  // 0 - filter less than 3
  t(collections.filter([1, 2, 3, 4], function (x) { return x < 3; }),
    [1, 2]);
  
  // 1 - filter equal "hello"
  t(collections.filter(["hi", "hello", "bye"], function (x) { return x === "hello" }),
    ["hello"]);
  
  // 2 - filter empty array
  t(collections.filter([], function (x) { return x; }),
    []);
  
  //________________________________________________________________________//
  // collections.sum
  //________________________________________________________________________//

  current_method = "sum";
  counter = 0;
  
  // 0 - sum array of integers
  t(collections.sum([1,2,3]),
    6);
  
  // 1 - sum array of mixed numbers
  t(collections.sum([1.5, 2.2, 6.2]),
    9.9);
  
  // 2 - sum array of length 1
  t(collections.sum([42]),
    42);
  
  // 3 - sum empty array
  t(collections.sum([]),
    0);
  
  // 4 - sum array of objects with selector
  t(collections.sum([{a:1}, {a:3}, {a:5}], function (x) { return x.a }),
    9);


  //________________________________________________________________________//
  // collections.min
  //________________________________________________________________________//

  current_method = "min";
  counter = 0;
  
  // 0 - min over array of positive integers
  t(collections.min([3, 1, 2]),
    1);
  
  // 1 - min over array of positive and negative integers
  t(collections.min([3, 1, -2, 4]),
    -2);
  
  // 2 - min over empty array
  t(collections.min([]),
    Infinity)
  
  
  //________________________________________________________________________//
  // collections.max
  //________________________________________________________________________//

  current_method = "max";
  counter = 0;
  
  // 0 - max over array of positive integers
  t(collections.max([2, 3, 1]),
    3);
  
  // 1 - max over array of positive and negative integers
  t(collections.max([1, -2, 3, 2]),
    3);
  
  // 2 - min over empty array
  t(collections.max([]),
    -Infinity)
  
  

  console.log("Tests completed!");
})();
