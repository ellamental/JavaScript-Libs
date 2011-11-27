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
        tmp.push(t);
      }
    }
    return t;
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
  
  max: function (arr, selector) {
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
  var counter = 0;
  function t(expr, expected) {
    if (expr !== expected) {
      console.log("Test Failed! #"+counter);
    }
    counter++;
  }
  
  // 0 - sum array of integers
  t(collections.sum([1,2,3]), 6);
  
  // 1 - sum array of mixed numbers
  t(collections.sum([1.5, 2.2, 6.2]), 9.9);
  
  // 2 - sum array of length 1
  t(collections.sum([42]), 42);
  
  // 3 - sum empty array
  t(collections.sum([]), 0);
  
  // 4 - sum array of objects with selector
  t(collections.sum([{a:1}, {a:3}, {a:5}], function (x) { return x.a }), 9);
  
})();
