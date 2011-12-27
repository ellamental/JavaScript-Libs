//___________________________________________________________________________//
// srfi1
//
// srfi1 is a 'just for fun' implementation of Scheme's SRFI-1 library
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


var srfi1 = {};
  
//________________________________________________________________________//
// Pair type
//________________________________________________________________________//

srfi1.Pair = function (car, cdr) {
  this.car = car;
  this.cdr = cdr;
};


//________________________________________________________________________//
// Equality
//________________________________________________________________________//

srfi1.is_equal = function (a, b) {
  // General equality that works on Pair, Array and any type === works for.
  if (a instanceof srfi1.Pair && b instanceof srfi1.Pair) {
    if (srfi1.is_equal(a.car, b.car)) {
      return srfi1.is_equal(a.cdr, b.cdr);
    }
    else {
      return false;
    }
  }
  // Array equality returns true if is_equal returns true for all elements
  else if (a instanceof Array && b instanceof Array) {
    if (a.length === b.length) {
      for (var i=0,j=a.length; i < j; i++) {
        if (!srfi1.is_equal(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  else {
    return a === b;
  }
};


//________________________________________________________________________//
// Constructors
//
// Implemented: cons  list  xcons  cons_list(cons*)  make_list
//              list_tabulate  list_copy  circular_list  iota
//________________________________________________________________________//

srfi1.cons = function (car, cdr) {
  // should this throw an error if cdr is not provided or coerce cdr to null?
  return new srfi1.Pair(car, cdr);
};

srfi1.list = function (/* elem, ..., elem-n */) {
  var lst = null;
  for (var i=arguments.length-1; i >= 0; i--) {
    lst = srfi1.cons(arguments[i], lst);
  }
  return lst;
};

srfi1.xcons = function (cdr, car) {
  // eXchanged cons
  return srfi1.cons(car, cdr);
};

srfi1.cons_list = function (/* elem, ..., elem-n */) {
  // cons* - like list except the last value is used as the tail
  var last_arg = arguments.length-1,
      lst = arguments[last_arg];
  for (var i=last_arg-1; i >= 0; i--) {
    lst = srfi1.cons(arguments[i], lst);
  }
  return lst;
};

srfi1.make_list = function (n, fill) {
  // Returns an n-element list, whose elements are all the value fill. If the 
  // fill argument is not given, the elements of the list will be undefined. 
  var lst = null;
  for (var i=0; i < n; i++) {
    lst = srfi1.cons(fill, lst);
  }
  return lst;
};

srfi1.list_tabulate = function (n, init_proc) {
  // Returns an n-element list. Element i of the list, where 0 <= i < n, 
  // is produced by (init-proc i).  No guarantee is made about the dynamic 
  // order in which init-proc is applied to these indices. 
  var lst = null;
  for (var i=n-1; i >= 0; i--) {
    lst = srfi1.cons(init_proc(i), lst);
  }
  return lst;
};

srfi1.list_copy = function (lst) {
  // Return a shallow copy of lst
  if (lst instanceof srfi1.Pair) {
    return srfi1.cons(lst.car, srfi1.list_copy(lst.cdr));
  }
  else {
    return lst;
  }
};

srfi1.circular_list = function (/* elem, ..., elem-n */) {
  var first_node = srfi1.cons(arguments[0], null),
      lst = first_node;
  for (var i=arguments.length-1; i >= 1; i--) {
    lst = srfi1.cons(arguments[i], lst);
  }
  first_node.cdr = lst;
  return first_node;
};

srfi1.iota = function (start, stop, step) {
  // Returns a list containing the elements:
  // (start start+step ... start+(count-1)*step)
  // The start and step parameters default to 0 and 1, respectively.
  step = (typeof step === 'undefined') ? 1 : step;
  if (typeof stop === 'undefined') {
    stop = start;
    start = 0;
  }
  else {
    stop = start + stop;
  }
  var temp = [];
  
  for (var i = start; i < stop; i += step) {
    temp.push(i);
  }
  return srfi1.list.apply(this, temp);
};


//________________________________________________________________________//
// Predicates
//
// Implemented: is_pair(pair?)  is_null  not_pair  is_proper_list?
//              is_circular_list  is_dotted_list  is_null_list
//
// Not yet implemented: list=
//________________________________________________________________________//

srfi1.is_pair = function (elem) {
  return (elem instanceof srfi1.Pair);
};

srfi1.not_pair = function (elem) {
  return !(elem instanceof srfi1.Pair);
};

srfi1.is_null = function (elem) {
  return elem === null;
};

srfi1.is_proper_list = function (list) {
  var first_node = list;
  if (list === null || list.cdr === null) {
    return true;
  }
  else if (!(list.cdr instanceof srfi1.Pair)) {
    return false;
  }
  list = list.cdr;
  while (list !== null) {
    if (list === first_node) {
      return false;
    }
    else if (!(list instanceof srfi1.Pair)) {
      return false;
    }
    list = list.cdr;
  }
  return true;
};

srfi1.is_circular_list = function (list) {
  var tortoise, hare;
  if (!(list instanceof srfi1.Pair)) { return false; }
  tortoise = list;
  hare = list.cdr;
  while (hare instanceof srfi1.Pair && tortoise !== hare) {
    tortoise = tortoise.cdr;
    hare = hare.cdr;
    if (tortoise === hare) { return true; }
    else if (!(hare instanceof srfi1.Pair)) { return false; }
    hare = hare.cdr;
    if (tortoise === hare) { return true; }
  }
  return false;
};

srfi1.is_dotted_list = function (list) {
  var first_node = list;
  if (!(list instanceof srfi1.Pair) || list.cdr === null) { return false; }
  list = list.cdr;
  while (list instanceof srfi1.Pair) {
    if (list === first_node) {
      return false;
    }
    else if (list.cdr === null) {
      return false;
    }
    list = list.cdr;
  }
  return true;
};

srfi1.is_null_list = function (list) {
  if (list === null) {
    return true;
  }
  else {
    return false;
  }
};


//________________________________________________________________________//
// Selectors
//
// Implemented: car  cdr  rest(not srfi-1)  c...r  list_ref  first...tenth
//              take/drop  take/drop-right  split_at  last  last_pair car_cdr
//________________________________________________________________________//

// Canonical Lisp accessor functions
srfi1.car = function (p) { return p.car; };
srfi1.cdr = function (p) { return p.cdr; };

// Clojure/Racket aliases for car/cdr
srfi1.first = function (p) { return p.car; };
srfi1.rest = function (p) { return p.cdr; };

srfi1.caar = function (p) { return p.car.car; };
srfi1.cadr = function (p) { return p.cdr.car; };
srfi1.cdar = function (p) { return p.car.cdr; };
srfi1.cddr = function (p) { return p.cdr.cdr; };

srfi1.caaar = function (p) { return p.car.car.car; };
srfi1.caadr = function (p) { return p.cdr.car.car; };
srfi1.cadar = function (p) { return p.car.cdr.car; };
srfi1.caddr = function (p) { return p.cdr.cdr.car; };
srfi1.cdaar = function (p) { return p.car.car.cdr; };
srfi1.cdadr = function (p) { return p.cdr.car.cdr; };
srfi1.cddar = function (p) { return p.car.cdr.cdr; };
srfi1.cdddr = function (p) { return p.cdr.cdr.cdr; };

srfi1.list_ref = function (lst, index) {
  for (var i=0; i < index; i++) {
    lst = lst.cdr;
  }
  return lst.car;
};

srfi1.second =  function (p) { return srfi1.list_ref(p, 1); };
srfi1.third =   function (p) { return srfi1.list_ref(p, 2); };
srfi1.fourth =  function (p) { return srfi1.list_ref(p, 3); };
srfi1.fifth =   function (p) { return srfi1.list_ref(p, 4); };
srfi1.sixth =   function (p) { return srfi1.list_ref(p, 5); };
srfi1.seventh = function (p) { return srfi1.list_ref(p, 6); };
srfi1.eighth =  function (p) { return srfi1.list_ref(p, 7); };
srfi1.ninth =   function (p) { return srfi1.list_ref(p, 8); };
srfi1.tenth =   function (p) { return srfi1.list_ref(p, 9); };

srfi1.car_cdr = function (list) {
  // Javascript does not have a standardized way to return multiple values.
  // Some implementations (Mozilla) provide destructuring assignment using
  // arrays.  So the value returned by this function will be an array where:
  // [(car list), (cdr list)] instead of (values (car list) (cdr list))
  return [list.car, list.cdr];
};

srfi1.take = function (list, n) {
  // take returns the first n elements of list x.  take is guaranteed to
  // return a freshly-allocated list, even in the case where the entire
  // list is taken.
  if (n === 0) {
    return null;
  }
  else {
    return srfi1.cons(list.car, srfi1.take(list.cdr, n-1));
  }
};

srfi1.drop = function (list, n) {
  // drop returns all but the first n elements of list x.  drop is exactly
  // equivalent to performing n cdr operations on x; the returned value
  // shares a common tail with x.
  for (var i=0; i < n; i++) {
    list = list.cdr;
  }
  return list;
};

srfi1.take_right = function (list, n) {
  // take-right returns the last i elements of list.
  var return_value;
  function loop(lag, lead) {
    if (srfi1.is_pair(lead)) {
      loop(lag.cdr, lead.cdr);
    }
    else {
      return_value = lag;
    }
  }
  loop(list, srfi1.drop(list, n));
  return return_value;
};

srfi1.drop_right = function (list, n) {
  // drop-right returns all but the last i elements of list.
  function loop(lag, lead) {
    if (srfi1.is_pair(lead)) {
      return srfi1.cons(lag.car, loop(lag.cdr, lead.cdr));
    }
    else {
      return null;
    }
  }
  return loop(list, srfi1.drop(list, n));
};

srfi1.split_at = function (list, n) {
  // split-at splits the list x at index i, returning a pair containing a
  // list of the first i elements, and the remaining tail.
  return srfi1.cons(srfi1.take(list, n), srfi1.drop(list, n));
};

srfi1.last = function (list) {
  while (list.cdr !== null) {
    list = list.cdr;
  }
  return list.car;
};

srfi1.last_pair = function (list) {
  while (list.cdr !== null) {
    list = list.cdr;
  }
  return list;
};


//________________________________________________________________________//
// Miscellaneous
//
// Implemented:  length  length_plus  append  concatenate  reverse
//               append-reverse  zip  unzip1  unzip2  unzip3  unzip4  unzip5
//               count  append_d  concatenate_d  reverse_d  append-reverse_d
//________________________________________________________________________//

srfi1.length = function (list) {
  // It is an error to pass a value to length which is not a proper and null
  // terminated list.  This implementation allows for improper lists and
  // will return the number of pairs which make up the list.
  var len = 0;
  while (list instanceof srfi1.Pair) {
    len += 1;
    list = list.cdr;
  }
  return len;
};

srfi1.length_plus = function (list) {
  // Same as length, but returns false when given a circular list.
  var head = list,
      len = 1;
  if (list === null) { return 0; }
  list = list.cdr;
  while (list instanceof srfi1.Pair) {
    if (list === head) {
      return false;
    }
    len += 1;
    list = list.cdr;
  }
  return len;
};

srfi1.length_circular = function (list) {
  // Same as length_plus but returns the length of circular lists.
  var head = list,
      len = 1;
  if (list === null) { return 0; }
  list = list.cdr;
  while (list instanceof srfi1.Pair) {
    if (list === head) {
      return len;
    }
    len += 1;
    list = list.cdr;
  }
  return len;
};

// This should be rewritten to traverse backward over the arguments.  The
// current implementation creates n! copies of the intermediate list where
// n = the number of arguments.
srfi1.append = function (a, b, c /* ... list-n */) {
  // append returns a list consisting of the elements of list1 followed by
  // the elements of the other list parameters.
  // The resulting list is always newly allocated, except that it shares
  // structure with the final list argument. This last argument may be any
  // value at all; an improper list results if it is not a proper list.
  // All other arguments must be proper lists.
  var l, args;
  function loop(f, s) {
    if (f instanceof srfi1.Pair) {
      return srfi1.cons(f.car, loop(f.cdr, s));
    }
    else {
      return s;
    }
  }
  l = loop(a, b);
  // fast path, avoids a call to the arguments object which is generally slow
  if (typeof c === 'undefined') {
    return l;
  }
  else {
    // convert arguments object to array, leaving off the first 2 arguments
    args = Array.prototype.slice.call(arguments, 2);
    args.unshift(l);
    return srfi1.append.apply(this, args);
  }
};

srfi1.append_d = function (/* list ... list-n */) {
  var first_node = arguments[0],
      current_node = first_node,
      i;
  for (i=0; i < arguments.length-1; i++) {
    while (current_node.cdr !== null) {
      current_node = current_node.cdr;
    }
    current_node.cdr = arguments[i+1];
  }
  return first_node;
};

srfi1.concatenate = function (lists) {
  var temp = [],
      current_list;
  while (lists !== null) {
    current_list = lists.car;
    while (current_list !== null) {
      temp.push(current_list.car);
      current_list = current_list.cdr;
    }
    lists = lists.cdr;
  }
  return srfi1.array_to_list(temp);
};

srfi1.concatenate_d = function (lists) {
  var first_node = lists.car,
      current_node = first_node;
  while (lists.cdr !== null) {
    while (current_node.cdr !== null) {
      current_node = current_node.cdr;
    }
    current_node.cdr = lists.cdr.car;
    lists = lists.cdr;
  }
  return first_node;
};

srfi1.reverse = function (list) {
  // reverse returns a newly allocated list consisting of the elements 
  // of list in reverse order. 
  var l = null;
  while (list !== null) {
    l = srfi1.cons(list.car, l);
    list = list.cdr;
  }
  return l;
};

srfi1.reverse_d = srfi1.reverse;
  // reverse_d is the linear-update variant of reverse. It is permitted, but
  // not required, to alter the argument's cons cells to produce the reversed
  // list.
  // Calls srfi1.reverse as there is no benefit to destroying list.

srfi1.append_reverse = function (list, tail) {
  var l = tail;
  while (list !== null) {
    l = srfi1.cons(list.car, l);
    list = list.cdr;
  }
  return l;
};

srfi1.append_reverse_d = srfi1.append_reverse;
  // append-reverse! is just the linear-update variant -- it is allowed, but
  // not required, to alter rev-head's cons cells to construct the result.
  // Calls srfi1.append_reverse as there is no benefit to destroying list.

srfi1.zip = function (/* list, ..., list-n */) {
  // convert arguments to an array
  var args = Array.prototype.slice.call(arguments, 0),
      num_args = args.length,
      temp_array = [],
      values,
      i;
  while (true) {
    values = null;
    for (i=num_args-1; i >= 0; i--) {
      if (args[i] !== null) {
        values = srfi1.cons(args[i].car, values);
        args[i] = args[i].cdr;
      }
      else {
        return srfi1.list.apply(this, temp_array);
      }
    }
    temp_array.push(values);
  }
};
  
srfi1.unzip1 = function (/* list, ..., list-n */) {
  // unzip1 takes a list of lists, where every list must contain at least
  // one element, and returns a list containing the initial element of each
  // such list. That is, it returns map(car, lists)
  var l = null;
  for (var i=arguments.length-1; i >= 0; i--) {
    l = srfi1.cons(arguments[i].car, l);
  }
  return l;
};

srfi1.unzip2 = function (/* list, ..., list-n */) {
  // unzip2 takes a list of lists, where every list must contain at least
  // two elements, and returns a list containing the initial element of each
  // such list. That is, it returns list(map(car, lists), map(cadr, lists))
  var l1 = null,
      l2 = null;
  for (var i=arguments.length-1; i >= 0; i--) {
    l1 = srfi1.cons(arguments[i].car, l1);
    l2 = srfi1.cons(arguments[i].cdr.car, l2);
  }
  return srfi1.list(l1, l2);
};

srfi1.unzip3 = function (/* list, ..., list-n */) {
  // returns list(map(car, lists), map(cadr, lists), map(caddr, lists))
  var l1 = null,
      l2 = null,
      l3 = null;
  for (var i=arguments.length-1; i >= 0; i--) {
    l1 = srfi1.cons(arguments[i].car, l1);
    l2 = srfi1.cons(arguments[i].cdr.car, l2);
    l3 = srfi1.cons(arguments[i].cdr.cdr.car, l3);
  }
  return srfi1.list(l1, l2, l3);
};

srfi1.unzip4 = function (/* list, ..., list-n */) {
  // returns list(map(car, lists), map(cadr, lists), map(caddr, lists), ...)
  var l1 = null,
      l2 = null,
      l3 = null,
      l4 = null;
  for (var i=arguments.length-1; i >= 0; i--) {
    l1 = srfi1.cons(arguments[i].car, l1);
    l2 = srfi1.cons(arguments[i].cdr.car, l2);
    l3 = srfi1.cons(arguments[i].cdr.cdr.car, l3);
    l4 = srfi1.cons(arguments[i].cdr.cdr.cdr.car, l4);
  }
  return srfi1.list(l1, l2, l3, l4);
};

srfi1.unzip5 = function (/* list, ..., list-n */) {
  // returns list(map(car, lists), map(cadr, lists), map(caddr, lists), ...)
  var l1 = null,
      l2 = null,
      l3 = null,
      l4 = null,
      l5 = null;
  for (var i=arguments.length-1; i >= 0; i--) {
    l1 = srfi1.cons(arguments[i].car, l1);
    l2 = srfi1.cons(arguments[i].cdr.car, l2);
    l3 = srfi1.cons(arguments[i].cdr.cdr.car, l3);
    l4 = srfi1.cons(arguments[i].cdr.cdr.cdr.car, l4);
    l5 = srfi1.cons(arguments[i].cdr.cdr.cdr.cdr.car, l5);
  }
  return srfi1.list(l1, l2, l3, l4, l5);
};

srfi1.count = function (pred /* list, ..., list-n */) {
  // pred is a function taking as many arguments as there are list arguments
  // and returning a single value. It is applied element-wise to the elements
  // of the lists, and a count is tallied of the number of elements that
  // produce a true value. This count is returned.
  var args = Array.prototype.slice.call(arguments, 1),
      num_args = args.length,
      count = 0,
      values,
      i, r;
  while (true) {
    values = [];
    for (i = 0; i < num_args; i++) {
      if (args[i] !== null) {
        values.push(args[i].car);
        args[i] = args[i].cdr;
      }
      else {
        return count;
      }
    }
    r = pred.apply(pred, values);
    if (r) {
      count += 1;
    }
  }
};


//________________________________________________________________________//
// Fold, unfold & map
//
// Implemented: map  fold  pair-fold  unfold  unfold_right  for_each
//              map_in_order  filter_map  reduce  reduce_right
//
// Not yet implemented: fold-right  pair-fold-right  append-map
//                      append-map!  map!  pair-for-each
//________________________________________________________________________//

srfi1.map = function (fn /* list, ..., list-n */) {
  // fn is a function taking as many arguments as there are list arguments
  // and returning a single value. map applies fn element-wise to the
  // elements of the lists and returns a list of the results, in order.
  var args = Array.prototype.slice.call(arguments, 1),
      num_args = args.length,
      temp_array = [],
      values,
      i;
  while (true) {
    values = [];
    for (i = 0; i < num_args; i++) {
      if (args[i] !== null) {
        values.push(args[i].car);
        args[i] = args[i].cdr;
      }
      else {
        return srfi1.list.apply(this, temp_array);
      }
    }
    temp_array.push(fn.apply(fn, values));
  }
};

srfi1.fold = function (kons, nil /* list, ..., list-n */) {
  var args = Array.prototype.slice.call(arguments, 2),
      num_args = args.length,
      temp = nil,
      values,
      i;
  while (true) {
    values = [];
    for (i=num_args-1; i >= 0; i--) {
      if (args[i] !== null) {
        values.push(args[i].car);
        args[i] = args[i].cdr;
      }
      else {
        return temp;
      }
    }
    values.push(temp);
    temp = kons.apply(kons, values);
  }
};

srfi1.pair_fold = function (kons, nil /* list, ..., list-n */) {
  var args = Array.prototype.slice.call(arguments, 2),
      num_args = args.length,
      temp = nil,
      values,
      i;
  while (true) {
    values = [];
    for (i=num_args-1; i >= 0; i--) {
      if (args[i] !== null) {
        values.push(args[i]);
        args[i] = args[i].cdr;
      }
      else {
        return temp;
      }
    }
    values.push(temp);
    temp = kons.apply(kons, values);
  }
};

srfi1.unfold = function (p, f, g, seed, tail_gen) {
  tail_gen = (typeof tail_gen === 'undefined') ? function (x) { return null; } : tail_gen;
  if (p(seed)) {
    return tail_gen(seed);
  }
  else {
    return srfi1.cons(f(seed),
                      srfi1.unfold(p, f, g, g(seed), tail_gen));
  }
};

srfi1.unfold_right = function (p, f, g, seed, tail) {
  tail = (typeof tail === 'undefined') ? null : tail;
  var list = tail;
  while (true) {
    if (p(seed)) {
      return tail;
    }
    else {
      tail = srfi1.cons(f(seed), tail);
      seed = g(seed);
    }
  }
};

srfi1.for_each = function (fn /* list, ..., list-n */) {
  // The arguments to for-each are like the arguments to map, but for-each
  // calls proc for its side effects rather than for its values. Unlike map,
  // for-each is guaranteed to call proc on the elements of the lists in
  // order from the first element(s) to the last, and the value returned by
  // for-each is undefined.
  var args = Array.prototype.slice.call(arguments, 1),
      num_args = args.length,
      values,
      i;
  while (true) {
    values = [];
    for (i = 0; i < num_args; i++) {
      if (args[i] !== null) {
        values.push(args[i].car);
        args[i] = args[i].cdr;
      }
      else {
        return undefined;
      }
    }
    fn.apply(fn, values);
  }
};

srfi1.map_in_order = function (fn /* list, ..., list-n */) {
  // A variant of the map procedure that guarantees to apply f across the 
  // elements of the list arguments in a left-to-right order.
  var args = Array.prototype.slice.call(arguments, 1),
      num_args = args.length,
      temp_array = [],
      values,
      i;
  while (true) {
    values = [];
    for (i = 0; i < num_args; i++) {
      if (args[i] !== null) {
        values.push(args[i].car);
        args[i] = args[i].cdr;
      }
      else {
        return srfi1.list.apply(this, temp_array);
      }
    }
    temp_array.push(fn.apply(fn, values));
  }
};

srfi1.filter_map = function (fn /* list, ..., list-n */) {
  // fn is a function taking as many arguments as there are list arguments
  // and returning a single value. map applies fn element-wise to the
  // elements of the lists and returns a list of the results, in order.
  var args = Array.prototype.slice.call(arguments, 1),
      num_args = args.length,
      temp_array = [],
      values,
      i, r;
  while (true) {
    values = [];
    for (i = 0; i < num_args; i++) {
      if (args[i] !== null) {
        values.push(args[i].car);
        args[i] = args[i].cdr;
      }
      else {
        return srfi1.list.apply(this, temp_array);
      }
    }
    r = fn.apply(fn, values);
    if (r) {
      temp_array.push(r);
    }
  }
};

srfi1.reduce = function (fn, init, list) {
  while (list !== null) {
    init = fn(list.car, init);
    list = list.cdr;
  }
  return init;
};

// Not sure if it's valid to simply reverse the list then do reduce on the
// reversed list, but it will avoid recursion errors on huge lists
srfi1.reduce_right = function (fn, init, list) {
  return srfi1.reduce(fn, init, srfi1.reverse(list));
};


//________________________________________________________________________//
// Filtering & partitioning
//
// Implemented: filter  filter_d  partition  partition_d  remove  remove_d
//________________________________________________________________________//

srfi1.filter = function (pred, list) {
  // Return all the elements of list that satisfy predicate pred.
  var l = null;
  while (list !== null) {
    if (pred(list.car)) {
      l = srfi1.cons(list.car, l);
    }
    list = list.cdr;
  }
  return srfi1.reverse(l);
};

srfi1.filter_d = function (pred, list) {
  if (list instanceof srfi1.Pair) {
    if (pred(list.car)) {
      list.cdr = srfi1.filter_d(pred, list.cdr);
      return list;
    }
    else {
      return srfi1.filter_d(pred, list.cdr);
    }
  }
  else {
    return null;
  }
};


srfi1.partition = function (pred, list) {
  // Partitions the elements of list with predicate pred, and returns two
  // values: the list of in-elements and the list of out-elements.
  var in_list = null,
      out_list = null;
  while (list !== null) {
    if (pred(list.car)) {
      in_list = srfi1.cons(list.car, in_list);
    }
    else {
      out_list = srfi1.cons(list.car, out_list);
    }
    list = list.cdr;
  }
  return srfi1.cons(srfi1.reverse(in_list), srfi1.reverse(out_list));
};

srfi1.partition_d = function (pred, list) {
  var out_list = null,
      in_list,
      recur;
  
  recur = function (lst) {
    if (lst instanceof srfi1.Pair) {
      if (pred(lst.car)) {
        lst.cdr = recur(lst.cdr);
        return lst;
      }
      else {
        out_list = srfi1.cons(lst.car, out_list);
        return recur(lst.cdr);
      }
    }
    else {
      return null;
    }
  };
  
  in_list = recur(list);
  return srfi1.cons(in_list, srfi1.reverse(out_list));
};

srfi1.remove = function (pred, list) {
  // Returns list without the elements that satisfy predicate pred
  var l = null;
  while (list !== null) {
    if (!pred(list.car)) {
      l = srfi1.cons(list.car, l);
    }
    list = list.cdr;
  }
  return srfi1.reverse(l);
};

srfi1.remove_d = function (pred, list) {
  if (list instanceof srfi1.Pair) {
    if (!pred(list.car)) {
      list.cdr = srfi1.remove_d(pred, list.cdr);
      return list;
    }
    else {
      return srfi1.remove_d(pred, list.cdr);
    }
  }
  else {
    return null;
  }
};


//________________________________________________________________________//
// Searching
//
// Implemented: member  memv  find  find-tail  any  every  list_index
//
// Not yet implemented: memq  take-while  drop-while
//                      take-while!  span  break  span!  break!
//________________________________________________________________________//

srfi1.member = function (elem, list, eq) {
  // returns the first sublist of list whose car is === to elem.
  // eq is an optional parameter to specify a different equality procedure
  eq = (typeof eq === 'undefined') ? function (a, b) { return srfi1.is_equal(a, b); } : eq;
  while (list !== null) {
    if (eq(elem, list.car)) {
      return list;
    }
    list = list.cdr;
  }
  return false;
};

srfi1.memv = function (elem, list) {
  // returns the first sublist of list whose car is === (eqv?) to elem.
  while (list !== null) {
    if (elem === list.car) {
      return list;
    }
    list = list.cdr;
  }
  return false;
};

srfi1.find = function (pred, list) {
  // Return the first element of clist that satisfies predicate pred; 
  // false if no element does. 
  while (list !== null) {
    if (pred(list.car)) {
      return list.car;
    }
    list = list.cdr;
  }
  return false;
};

srfi1.find_tail = function (pred, list) {
  // Return the first pair of clist whose car satisfies pred. If no pair
  // does, return false. 
  while (list !== null) {
    if (pred(list.car)) {
      return list;
    }
    list = list.cdr;
  }
  return false;
};

srfi1.any = function (pred /* list1, ..., listn */) {
  // Applies the predicate across the lists, returning the return value of
  // pred if the predicate returns a truthy value on any application.
  // pred must be a function taking n arguments and returning a boolean
  // result, where n is the number of list arguments passed to any.
  var args = Array.prototype.slice.call(arguments, 1),
      num_args = args.length,
      temp_array = [],
      values, v, i;
  while (true) {
    values = [];
    for (i=num_args-1; i >= 0; i--) {
      if (args[i] !== null) {
        values.push(args[i].car);
        args[i] = args[i].cdr;
      }
      else {
        return false;
      }
    }
    v = pred.apply(pred, values);
    if (v) {
      return v;
    }
  }
};

srfi1.every = function (pred /* list1, ..., listn */) {
  // Applies the predicate across the lists, returning the return value of
  // pred if the predicate returns a truthy value on every application.
  // pred must be a function taking n arguments and returning a boolean
  // result, where n is the number of list arguments passed to every.
  var args = Array.prototype.slice.call(arguments, 1),
      num_args = args.length,
      temp_array = [],
      values, v, i;
  while (true) {
    values = [];
    for (i=num_args-1; i >= 0; i--) {
      if (args[i] !== null) {
        values.push(args[i].car);
        args[i] = args[i].cdr;
      }
      else {
        return v;
      }
    }
    v = pred.apply(pred, values);
    if (!v) {
      return false;
    }
  }
};

srfi1.list_index = function (pred /* list1, ..., listn */) {
  // Applies the predicate across the lists, returning the count if the
  // predicate returns a truthy value on any application.
  // pred must be a function taking n arguments and returning a boolean
  // result, where n is the number of list arguments passed to list_index.
  var args = Array.prototype.slice.call(arguments, 1),
      num_args = args.length,
      temp_array = [],
      count = 0,
      values, i;
  while (true) {
    values = [];
    for (i=num_args-1; i >= 0; i--) {
      if (args[i] !== null) {
        values.push(args[i].car);
        args[i] = args[i].cdr;
      }
      else {
        return false;
      }
    }
    if (pred.apply(pred, values)) {
      return count;
    }
    count += 1;
  }
};


//________________________________________________________________________//
// Deleting
//
// Implemented: delete_elem(delete)
//
// Not yet implemented: delete-duplicates  delete!  delete-duplicates!
//________________________________________________________________________//

srfi1.delete_elem = function (x, list, eq_fn) {
  // delete_elem uses the comparison function eq_fn, which defaults to ===, 
  // to create a new list without any element equal to x.
  // Renamed from delete because reserved words are not allowed as object 
  // properties in older (< ECMA 5) implementations.
  var tmp_list = null;
  eq_fn = (typeof eq_fn === 'undefined') ? function (a, b) { return a === b; } :
                                                  eq_fn;
  while (list !== null) {
    if (!(eq_fn(x, list.car))) {
      tmp_list = srfi1.cons(list.car, tmp_list);
    }
    list = list.cdr;
  }
  return srfi1.reverse(tmp_list);
};


//________________________________________________________________________//
// Association lists
//
// Implemented: assoc  assv  alist_cons  alist-copy
//
// Not yet implemented: assq  alist-delete  alist-delete!
//________________________________________________________________________//

srfi1.assoc = function (key, alist, eq) {
  // alist must be an association list -- a list of pairs. assoc finds the
  // first pair in alist whose car field is key, and returns that pair. If
  // no pair in alist has key as its car, then false is returned.
  eq = (typeof eq === 'undefined') ? function (a, b) { return srfi1.is_equal(a, b); } :
                                      eq;
  while (alist !== null) {
    if (eq(key, alist.car.car)) {
      return alist.car;
    }
    alist = alist.cdr;
  }
  return false;
};

srfi1.assv = function (key, alist) {
  // alist must be an association list -- a list of pairs. assv finds the
  // first pair in alist whose car field is key, and returns that pair. If
  // no pair in alist has key as its car, then false is returned.
  // assv uses === (eqv?) as the comparison operator.
  while (alist !== null) {
    if (key === alist.car.car) {
      return alist.car;
    }
    alist = alist.cdr;
  }
  return false;
};

srfi1.alist_cons = function (key, value, alist) {
  // Cons a new alist entry mapping key -> value onto alist.
  return srfi1.cons(srfi1.cons(key, value), alist);
};

srfi1.alist_copy = function (alist) {
  if (alist instanceof srfi1.Pair) {
    return srfi1.cons(srfi1.cons(alist.car.car, alist.car.cdr),
                      srfi1.list_copy(alist.cdr));
  }
  else {
    return alist;
  }

};


//________________________________________________________________________//
// Set operations on lists
//
// Implemented: lset_union
//
// Not yet implemented: lset<=  lset=  lset_adjoin  lset_union!
//                      lset_intersection  lset_intersection!  lset_difference
//                      lset_difference!  lset_xor  lset_xor!
//                      lset_diff+intersection  lset_diff+intersection!
//________________________________________________________________________//

srfi1.lset_union = function (eq, a, b) {
  var r = srfi1.list_copy(a);
  while (b !== null) {
    if (!srfi1.member(b.car, a, eq)) {
      r = srfi1.cons(b.car, r);
    }
    b = b.cdr;
  }
  return r;
};


//________________________________________________________________________//
// Primitive side-effects
//
// Implemented: set_car  set_cdr
//________________________________________________________________________//

srfi1.set_car = function (list, val) {
  list.car = val;
};

srfi1.set_cdr = function (list, val) {
  list.cdr = val;
};


//________________________________________________________________________//
// Implementation specific helper functions (not in srfi-1)
//
// Implemented: to_array  to_string  array_to_list
//________________________________________________________________________//

srfi1.to_array = function (list) {
  // Converts list to a Javascript array
  var a = [];
  while (list !== null) {
    a.push(list.car);
    list = list.cdr;
  }
  return a;
};

srfi1.to_string = function (list) {
  // Return a string representation of list
  var s = "(";
  while (list instanceof srfi1.Pair) {
    if (list.car instanceof srfi1.Pair) {
      s += srfi1.to_string(list.car);
      if (list.cdr !== null) { s += " "; }
    }
    else {
      s += list.car;
      if (list.cdr !== null) { s += " "; }
    }
    list = list.cdr;
  }
  // Handle dotted pairs and improper lists
  if (list !== null) {
    s += ". "+list;
  }
  return s + ")";
};

srfi1.array_to_list = function (a) {
  var list = null,
      i = a.length - 1;
  for (i; i >= 0; i--) {
    list = srfi1.cons(a[i], list);
  }
  return list;
};
