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
  // Implemented: cons  list  xcons  cons_list(cons*)  make-list
  //              list-tabulate  list-copy
  //
  // Not yet implemented: circular-list  iota
  //________________________________________________________________________//
  
  cons: function (car, cdr) {
    // should this throw an error if cdr is not provided or coerce cdr to null?
    return new this.Pair(car, cdr);
  },
  
  list: function () {
    var lst = null;
    for (var i=arguments.length-1; i >= 0; i--) {
      lst = this.cons(arguments[i], lst);
    }
    return lst;
  },
  
  xcons: function (cdr, car) {
    // eXchanged cons
    return this.cons(car, cdr);
  },
  
  cons_list: function () {
    // cons* - like list except the last value is used as the tail
    var last_arg = arguments.length-1,
        lst = arguments[last_arg];
    for (var i=last_arg-1; i >= 0; i--) {
      lst = this.cons(arguments[i], lst);
    }
    return lst;
  },

  make_list: function (n, fill) {
    // Returns an n-element list, whose elements are all the value fill. If the 
    // fill argument is not given, the elements of the list will be undefined. 
    var lst = null;
    for (var i=0; i < n; i++) {
      lst = this.cons(fill, lst);
    }
    return lst;
  },
  
  list_tabulate: function (n, init_proc) {
    // Returns an n-element list. Element i of the list, where 0 <= i < n, 
    // is produced by (init-proc i).  No guarantee is made about the dynamic 
    // order in which init-proc is applied to these indices. 
    var lst = null;
    for (var i=n-1; i >= 0; i--) {
      lst = this.cons(init_proc(i), lst);
    }
    return lst;
  },
  
  list_copy: function (lst) {
    if (lst instanceof this.Pair) {
      return this.cons(lst.car, this.list_copy(lst.cdr));
    }
    else {
      return lst;
    }
  },
  
  
  //________________________________________________________________________//
  // Predicates
  //
  // Implemented: isPair(pair?)  null?  not-pair?
  //
  // Not yet implemented: proper-list?  circular-list?  dotted-list?
  //                      null-list?  list=
  //________________________________________________________________________//
  
  isPair: function (elem) {
    return (elem instanceof this.Pair);
  },
  
  notPair: function (elem) {
    return !(elem instanceof this.Pair);
  },
  
  isNull: function (elem) {
    return elem === null;
  },
  
  
  //________________________________________________________________________//
  // Selectors
  //
  // Implemented: car  cdr  rest(not srfi-1)  c...r  list_ref  first...tenth
  //
  // Not yet implemented: car_cdr(car+cdr)  take/drop  take/drop-right
  //                      split_at  last  last_pair
  //________________________________________________________________________//
  
  // Canonical Lisp accessor functions
  car: function (p) { return p.car; },
  cdr: function (p) { return p.cdr; },
  
  // Clojure/Racket aliases for car/cdr
  first: function (p) { return p.car; },
  rest: function (p) { return p.cdr; },
  
  caar: function (p) { return p.car.car; },
  cadr: function (p) { return p.cdr.car; },
  cdar: function (p) { return p.car.cdr; },
  cddr: function (p) { return p.cdr.cdr; },
  
  caaar: function (p) { return p.car.car.car; },
  caadr: function (p) { return p.cdr.car.car; },
  cadar: function (p) { return p.car.cdr.car; },
  caddr: function (p) { return p.cdr.cdr.car; },
  cdaar: function (p) { return p.car.car.cdr; },
  cdadr: function (p) { return p.cdr.car.cdr; },
  cddar: function (p) { return p.car.cdr.cdr; },
  cdddr: function (p) { return p.cdr.cdr.cdr; },
  
  list_ref: function (lst, index) {
    for (var i=0; i < index; i++) {
      lst = lst.cdr;
    }
    return lst.car;
  },
  
  second:  function (p) { return this.list_ref(p, 1); },
  third:   function (p) { return this.list_ref(p, 2); },
  fourth:  function (p) { return this.list_ref(p, 3); },
  fifth:   function (p) { return this.list_ref(p, 4); },
  sixth:   function (p) { return this.list_ref(p, 5); },
  seventh: function (p) { return this.list_ref(p, 6); },
  eighth:  function (p) { return this.list_ref(p, 7); },
  ninth:   function (p) { return this.list_ref(p, 8); },
  tenth:   function (p) { return this.list_ref(p, 9); }
  
};



//__________________________________________________________________________//
// tests
//__________________________________________________________________________//

(function () {
  var s = srfi1,
      counter, current_method;
    
  function t(expr, expected) {
    if (expected instanceof s.Pair) {
      if (!s.equal(expr, expected)) {
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
    var p = new s.Pair(1, 2);
    if (!(p instanceof s.Pair)) {
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
  t(s.cons(1, 2),
    new s.Pair(1, 2));
  
  // 1 - make a proper list of length 1
  t(s.cons(1, null),
    new s.Pair(1, null));
  
  // 2 - make a proper list of length 2
  t(s.cons(1, s.cons(2, null)),
    new s.Pair(1, new s.Pair(2, null)));
  
  // 3 - make list of length 1 with an improper nested list
  t(s.cons(s.cons(1, 2), null),
    new s.Pair(new s.Pair(1, 2), null));
  
  // 4 - make a list of length 1 with a proper nested list
  t(s.cons(s.cons(1, null), null),
    new s.Pair(new s.Pair(1, null), null));
  
  // 5 - make a list of length 2 with an improper list in the cdr
  t(s.cons(1, s.cons(2, 3)),
    new s.Pair(1, new s.Pair(2, 3)));
  
  // 6 - make a list of length 2 with improper lists in both car and cdr
  t(s.cons(s.cons(1, 2), s.cons(3, 4)),
    new s.Pair(new s.Pair(1, 2), new s.Pair(3, 4)));
  

  //________________________________________________________________________//
  // srfi1.list
  //________________________________________________________________________//

  current_method = "list";
  counter = 0;
  
  // 0 - list with no arguments
  t(s.list(),
    null);
  
  // 1 - list of length 1
  t(s.list(1),
    s.cons(1, null));
  
  // 2 - list of length 2
  t(s.list(1, 2),
    s.cons(1, s.cons(2, null)));
  
  // 3 - list with embedded list
  t(s.list(s.list(1), 2),
    s.cons(s.cons(1, null), s.cons(2, null)));
  
  
  //________________________________________________________________________//
  // srfi1.xcons
  //________________________________________________________________________//

  current_method = "xcons";
  counter = 0;
  
  // 0 - pair
  t(s.xcons(2, 1),
    s.cons(1, 2));
  
  // 1 - proper list
  t(s.xcons(s.list(2, 3), 1),
    s.list(1, 2, 3));
    
  
  //________________________________________________________________________//
  // srfi1.cons_list
  //________________________________________________________________________//

  current_method = "cons_list";
  counter = 0;
  
  // 0
  t(s.cons_list(1, 2, 3),
    s.cons(1, s.cons(2, 3)));
  
  // 1 - pair
  t(s.cons_list(1, 2),
    s.cons(1, 2));
  
  // 2 - too few arguments
  // s.cons_list(1) should error instead of returning (1, undefined)
  
  
  //________________________________________________________________________//
  // srfi1.make_list
  //________________________________________________________________________//

  current_method = "make_list";
  counter = 0;
  
  // 0 - (1 1 1)
  t(s.make_list(3, 1),
    s.list(1, 1, 1));
  
  // 1 - no arguments
  t(s.make_list(),
    null);

  
  //________________________________________________________________________//
  // srfi1.list_tabulate
  //________________________________________________________________________//

  current_method = "list_tabulate";
  counter = 0;
  
  // 0 - (1 2 3)
  t(s.list_tabulate(3, function (i) { return i; }),
    s.list(1, 2, 3));
  

  //________________________________________________________________________//
  // srfi1.list_copy
  //________________________________________________________________________//

  current_method = "list_copy";
  counter = 0;
  
  // 0 - copy a proper list
  t(s.list_copy(s.list(1, 2, 3)),
    s.list(1, 2, 3));
  
  // 1 - copy a pair
  t(s.list_copy(s.cons(1, 2)),
    s.cons(1, 2));
  
  // 2 - copy an improper list
  t(s.list_copy(s.cons(1, s.cons(2, 3))),
    s.cons(1, s.cons(2, 3)));
  

  //________________________________________________________________________//
  // srfi1.isPair and srfi1.notPair
  //________________________________________________________________________//

  current_method = "isPair";
  counter = 0;
  
  // 0 - pair
  t(s.isPair(s.cons(1, 2)),
    true);
  
  // 1 - list
  t(s.isPair(s.list(1, 2, 3)),
    true);
  
  // 2 - null
  t(s.isPair(null),
    false);
  
  // 3 - integer
  t(s.isPair(42),
    false);
  
  // 4 - pair
  t(s.notPair(s.cons(1, 2)),
    false);
  
  // 5 - list
  t(s.notPair(s.list(1, 2, 3)),
    false);
  
  // 6 - null
  t(s.notPair(null),
    true);
  
  // 7 - integer
  t(s.notPair(42),
    true);
  
  
  //________________________________________________________________________//
  // srfi1.isNull
  //________________________________________________________________________//

  current_method = "isNull";
  counter = 0;
  
  // 0 - null
  t(s.isNull(null),
    true);
  
  // 1 - pair
  t(s.isNull(s.cons(1, 2)),
    false);
  
  
  //________________________________________________________________________//
  // srfi1.car and srfi1.first
  //________________________________________________________________________//

  current_method = "car";
  counter = 0;
  
  // 0 - pair
  t(s.car(s.cons(1, 2)),
    1);
  
  // 1 - list
  t(s.car(s.list(1, 2, 3)),
    1);
  
  // 2 - embedded pair
  t(s.car(s.list(s.cons(1, 2), 3)),
    s.cons(1, 2));
  
  // 3 - list
  t(s.first(s.list(1, 2, 3)),
    1);
  

  //________________________________________________________________________//
  // srfi1.cdr and srfi1.rest
  //________________________________________________________________________//

  current_method = "cdr";
  counter = 0;
  
  // 0 - pair
  t(s.cdr(s.cons(1, 2)),
    2);
  
  // 1 - 1 element list
  t(s.cdr(s.cons(1, null)),
    null);
  
  // 2 - 3 element list
  t(s.cdr(s.list(1, 2, 3)),
    s.list(2, 3));
  
  // 2 - 3 element list
  t(s.rest(s.list(1, 2, 3)),
    s.list(2, 3));

  
  //________________________________________________________________________//
  // srfi1.c...r
  //________________________________________________________________________//

  current_method = "c...r";
  counter = 0;
  
  var crlist = s.list(
                 s.list(
                   s.list(1, 2, 3),
                   s.list(4, 5, 6),
                   s.list(7, 8, 9)
                 ),
                 s.list(
                   s.list(10, 11, 12),
                   s.list(13, 14, 15),
                   s.list(16, 17, 18)
                 ),
                 s.list(
                   s.list(19, 20, 21),
                   s.list(22, 23, 24),
                   s.list(25, 26, 27)
                 )
               );
  
  // 0-3
  t(s.caar(crlist),
    s.list(1, 2, 3));
  t(s.cadr(crlist),
    s.list(s.list(10, 11, 12), s.list(13, 14, 15), s.list(16, 17, 18)));
  t(s.cdar(crlist),
    s.list(s.list(4, 5, 6), s.list(7, 8, 9)));
  t(s.cddr(crlist),
    s.list(s.list(s.list(19, 20, 21), s.list(22, 23, 24), s.list(25, 26, 27))));

  // 4-11
  t(s.caaar(crlist),
    1);
  t(s.caadr(crlist),
    s.list(10, 11, 12));
  t(s.cadar(crlist),
    s.list(4, 5, 6));
  t(s.caddr(crlist),
    s.list(s.list(19, 20, 21), s.list(22, 23, 24), s.list(25, 26, 27)));
  t(s.cdaar(crlist),
    s.list(2, 3));
  t(s.cdadr(crlist),
    s.list(s.list(13, 14, 15), s.list(16, 17, 18)));
  t(s.cddar(crlist),
    s.list(s.list(7, 8, 9)));
  t(s.cdddr(crlist),
    null);

  
  //________________________________________________________________________//
  // srfi1.list_ref
  //________________________________________________________________________//

  current_method = "list_ref";
  counter = 0;
  
  // 0 - get first element
  t(s.list_ref(s.list(1, 2, 3), 0),
    1);
  
  // 1 - get last element
  t(s.list_ref(s.list(1, 2, 3), 2),
    3);
  
  
  //________________________________________________________________________//
  // srfi1.second...tenth
  //________________________________________________________________________//

  current_method = "first...tenth";
  counter = 0;
  
  // 0-8
  t(s.second(s.list(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)),
    2);
  t(s.third(s.list(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)),
    3);
  t(s.fourth(s.list(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)),
    4);
  t(s.fifth(s.list(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)),
    5);
  t(s.sixth(s.list(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)),
    6);
  t(s.seventh(s.list(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)),
    7);
  t(s.eighth(s.list(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)),
    8);
  t(s.ninth(s.list(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)),
    9);
  t(s.tenth(s.list(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)),
    10);
  
  
  
  console.log("Tests completed!");
})();
