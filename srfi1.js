//___________________________________________________________________________//
// srfi1
//
// srfi1 is a 'just for fun' implementation of Scheme's SRFI-1 library
//
// srfi1 is free software: you can redistribute it and/or
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



var srfi1 = {
  
  //________________________________________________________________________//
  // Pair type
  //________________________________________________________________________//
  
  Pair: function (car, cdr) {
    this.car = car;
    this.cdr = cdr;
  },
  
  
  //________________________________________________________________________//
  // Equality
  //________________________________________________________________________//
  
  equal: function (a, b) {
    // handle end of list
    if (a === null || b === null) {
      if (a === b) {
        return true;
      }
      else {
        return false;
      }
    }
    // handle improper lists
    else if (typeof a === "undefined" || typeof b === "undefined") {
      if (a === b) {
        return true;
      }
      else {
        return false;
      }
    }
    // handle nested lists
    else if (a instanceof this.Pair && b instanceof this.Pair) {
      if (this.equal(a.car, b.car)) {
        return this.equal(a.cdr, b.cdr);
      }
      else {
        return false;
      }
    }
    // if cars are atoms and equal recurse
    else if (a.car === b.car) {
      return this.equal(a.cdr, b.cdr);
    }
    // if cars are not equal return false
    else {
      return false;
    }
  },
  
  
  //________________________________________________________________________//
  // Constructors
  // 
  // Implemented: cons
  // 
  // Not yet implemented: list  xcons  cons*  make-list  list-tabulate 
  //                      list-copy  circular-list  iota
  //________________________________________________________________________//
  
  cons: function (car, cdr) {
    // should this throw an error if cdr is not provided or coerce cdr to null?
    return new this.Pair(car, cdr);
  },
  
  list: function () {
    var arg_length = arguments.length,
        lst = null;
    for (var i=arguments.length-1; i >= 0; i--) {
      lst = this.cons(arguments[i], lst);
    }
    return lst;
  }
  
  
};





//__________________________________________________________________________//
// tests
//__________________________________________________________________________//

(function () {
  var counter, current_method;
    
  function t(expr, expected) {
    if (expected instanceof srfi1.Pair) {
      if (!srfi1.equal(expr, expected)) {
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
  // srfi1.Pair
  //________________________________________________________________________//

  (function () {
    var p = new srfi1.Pair(1, 2);
    if (!(p instanceof srfi1.Pair)) {
      console.log("Test Failed! srfi1.Pair(1, 2) is not instanceof srfi1.Pair");
    }
    else if (p.car !== 1) {
      console.log("Test Failed! Pair: p.car !== 1");
    }
    else if (p.cdr !== 2) {
      console.log("Test Failed! Pair: p.cdr !== 2");
    }
  })();


  //________________________________________________________________________//
  // srfi1.cons (also tests srfi1.equal)
  //________________________________________________________________________//

  current_method = "cons";
  counter = 0;
  
  // 0 - cons two integers
  t(srfi1.cons(1, 2),
    new srfi1.Pair(1, 2));
  
  // 1 - make a proper list of length 1
  t(srfi1.cons(1, null),
    new srfi1.Pair(1, null));
  
  // 2 - make a proper list of length 2
  t(srfi1.cons(1, srfi1.cons(2, null)),
    new srfi1.Pair(1, new srfi1.Pair(2, null)));
  
  // 3 - make list of length 1 with an improper nested list
  t(srfi1.cons(srfi1.cons(1, 2), null),
    new srfi1.Pair(new srfi1.Pair(1, 2), null));
  
  // 4 - make a list of length 1 with a proper nested list
  t(srfi1.cons(srfi1.cons(1, null), null),
    new srfi1.Pair(new srfi1.Pair(1, null), null));
  
  // 5 - make a list of length 2 with an improper list in the cdr
  t(srfi1.cons(1, srfi1.cons(2, 3)),
    new srfi1.Pair(1, new srfi1.Pair(2, 3)));
  
  // 6 - make a list of length 2 with improper lists in both car and cdr
  t(srfi1.cons(srfi1.cons(1, 2), srfi1.cons(3, 4)),
    new srfi1.Pair(new srfi1.Pair(1, 2), new srfi1.Pair(3, 4)));
  

  //________________________________________________________________________//
  // srfi1.list
  //________________________________________________________________________//

  current_method = "list";
  counter = 0;
  
  // 0 - list with no arguments
  t(srfi1.list(),
    null);
  
  // 1 - list of length 1
  t(srfi1.list(1),
    srfi1.cons(1, null));
  
  // 2 - list of length 2
  t(srfi1.list(1, 2),
    srfi1.cons(1, srfi1.cons(2, null)));
  
  // 3 - list with embedded list
  t(srfi1.list(srfi1.list(1), 2),
    srfi1.cons(srfi1.cons(1, null), srfi1.cons(2, null)));
  
  
  console.log("Tests completed!");
})();
