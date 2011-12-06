//___________________________________________________________________________//
// srfi1
//
// srfi1 is a 'just for fun' implementation of Scheme's SRFI-1 library
//
// Copyright (c) 2011, Nick Zarczynski
// All rights reserved.
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
  // Implemented: cons  list  xcons  cons_list(cons*)  make_list
  //              list_tabulate  list_copy  circular_list  iota
  //________________________________________________________________________//
  
  cons: function (car, cdr) {
    // should this throw an error if cdr is not provided or coerce cdr to null?
    return new this.Pair(car, cdr);
  },
  
  list: function (/* elem, ..., elem-n */) {
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
  
  cons_list: function (/* elem, ..., elem-n */) {
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
    // Return a shallow copy of lst
    if (lst instanceof this.Pair) {
      return this.cons(lst.car, this.list_copy(lst.cdr));
    }
    else {
      return lst;
    }
  },
  
  circular_list: function (/* elem, ..., elem-n */) {
    var first_node = this.cons(arguments[0], null),
        lst = first_node;
    for (var i=arguments.length-1; i >= 1; i--) {
      lst = this.cons(arguments[i], lst);
    }
    first_node.cdr = lst;
    return first_node;
  },
  
  iota: function (start, stop, step) {
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
    return this.list.apply(this, temp);
  },
  
  
  //________________________________________________________________________//
  // Predicates
  //
  // Implemented: is_pair(pair?)  is_null  not_pair  is_proper_list?
  //              is_circular_list  is_dotted_list  is_null_list
  //
  // Not yet implemented: list=
  //________________________________________________________________________//
  
  is_pair: function (elem) {
    return (elem instanceof this.Pair);
  },
  
  not_pair: function (elem) {
    return !(elem instanceof this.Pair);
  },
  
  is_null: function (elem) {
    return elem === null;
  },
  
  is_proper_list: function (list) {
    var first_node = list;
    if (list === null || list.cdr === null) {
      return true;
    }
    else if (!(list.cdr instanceof this.Pair)) {
      return false;
    }
    list = list.cdr;
    while (list !== null) {
      if (list === first_node) {
        return false;
      }
      else if (!(list instanceof this.Pair)) {
        return false;
      }
      list = list.cdr;
    }
    return true;
  },
  
  is_circular_list: function (list) {
    var first_node = list;
    if (!(list instanceof this.Pair)) { return false; }
    list = list.cdr;
    while (list instanceof this.Pair) {
      if (list === first_node) {
        return true;
      }
      list = list.cdr;
    }
    return false;
  },
  
  is_dotted_list: function (list) {
    var first_node = list;
    if (!(list instanceof this.Pair) || list.cdr === null) { return false; }
    list = list.cdr;
    while (list instanceof this.Pair) {
      if (list === first_node) {
        return false;
      }
      else if (list.cdr === null) {
        return false;
      }
      list = list.cdr;
    }
    return true;
  },
  
  is_null_list: function (list) {
    if (list === null) {
      return true;
    }
    else {
      return false;
    }
  },
  
  
  //________________________________________________________________________//
  // Selectors
  //
  // Implemented: car  cdr  rest(not srfi-1)  c...r  list_ref  first...tenth
  //              take/drop  take/drop-right  split_at  last  last_pair
  //
  // Not yet implemented: car_cdr(car+cdr)
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
  tenth:   function (p) { return this.list_ref(p, 9); },
  
  take: function (list, n) {
    // take returns the first n elements of list x.  take is guaranteed to
    // return a freshly-allocated list, even in the case where the entire
    // list is taken.
    if (n === 0) {
      return null;
    }
    else {
      return this.cons(list.car, this.take(list.cdr, n-1));
    }
  },
  
  drop: function (list, n) {
    // drop returns all but the first n elements of list x.  drop is exactly
    // equivalent to performing n cdr operations on x; the returned value
    // shares a common tail with x.
    for (var i=0; i < n; i++) {
      list = list.cdr;
    }
    return list;
  },
  
  take_right: function (list, n) {
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
    loop(list, this.drop(list, n));
    return return_value;
  },

  drop_right: function (list, n) {
    // drop-right returns all but the last i elements of list.
    function loop(lag, lead) {
      if (srfi1.is_pair(lead)) {
        return srfi1.cons(lag.car, loop(lag.cdr, lead.cdr));
      }
      else {
        return null;
      }
    }
    return loop(list, this.drop(list, n));
  },
  
  split_at: function (list, n) {
    // split-at splits the list x at index i, returning a pair containing a
    // list of the first i elements, and the remaining tail.
    return this.cons(this.take(list, n), this.drop(list, n));
  },
  
  last: function (list) {
    while (list.cdr !== null) {
      list = list.cdr;
    }
    return list.car;
  },
  
  last_pair: function (list) {
    while (list.cdr !== null) {
      list = list.cdr;
    }
    return list;
  },
  
  
  //________________________________________________________________________//
  // Miscellaneous
  //
  // Implemented:  length  length_plus  append  concatenate  reverse
  //               append-reverse  zip  unzip1  unzip2  unzip3  unzip4  unzip5
  //               count
  //
  // Not yet implemented: append!  concatenate!  reverse!  append-reverse!
  //________________________________________________________________________//
  
  length: function (list) {
    // It is an error to pass a value to length which is not a proper and null
    // terminated list.  This implementation allows for improper lists and
    // will return the number of pairs which make up the list.
    var len = 0;
    while (list instanceof this.Pair) {
      len += 1;
      list = list.cdr;
    }
    return len;
  },
  
  length_plus: function (list) {
    // Same as length, but returns false when given a circular list.
    var head = list,
        len = 1;
    if (list === null) { return 0; }
    list = list.cdr;
    while (list instanceof this.Pair) {
      if (list === head) {
        return false;
      }
      len += 1;
      list = list.cdr;
    }
    return len;
  },
  
  length_circular: function (list) {
    // Same as length_plus but returns the length of circular lists.
    var head = list,
        len = 1;
    if (list === null) { return 0; }
    list = list.cdr;
    while (list instanceof this.Pair) {
      if (list === head) {
        return len;
      }
      len += 1;
      list = list.cdr;
    }
    return len;
  },
  
  // This should be rewritten to traverse backward over the arguments.  The
  // current implementation creates n! copies of the intermediate list where
  // n = the number of arguments.
  append: function (a, b, c /* ... list-n */) {
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
      return this.append.apply(this, args);
    }
  },
  
  concatenate: function (lists) {
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
    return this.array_to_list(temp);
  },
  
  reverse: function (list) {
    // reverse returns a newly allocated list consisting of the elements 
    // of list in reverse order. 
    var l = null;
    while (list !== null) {
      l = this.cons(list.car, l);
      list = list.cdr;
    }
    return l;
  },
  
  append_reverse: function (list, tail) {
    var l = tail;
    while (list !== null) {
      l = this.cons(list.car, l);
      list = list.cdr;
    }
    return l;
  },
  
  zip: function (/* list, ..., list-n */) {
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
          values = this.cons(args[i].car, values);
          args[i] = args[i].cdr;
        }
        else {
          return this.list.apply(this, temp_array);
        }
      }
      temp_array.push(values);
    }
  },
    
  unzip1: function (/* list, ..., list-n */) {
    // unzip1 takes a list of lists, where every list must contain at least
    // one element, and returns a list containing the initial element of each
    // such list. That is, it returns map(car, lists)
    var l = null;
    for (var i=arguments.length-1; i >= 0; i--) {
      l = this.cons(arguments[i].car, l);
    }
    return l;
  },
  
  unzip2: function (/* list, ..., list-n */) {
    // unzip2 takes a list of lists, where every list must contain at least
    // two elements, and returns a list containing the initial element of each
    // such list. That is, it returns list(map(car, lists), map(cadr, lists))
    var l1 = null,
        l2 = null;
    for (var i=arguments.length-1; i >= 0; i--) {
      l1 = this.cons(arguments[i].car, l1);
      l2 = this.cons(arguments[i].cdr.car, l2);
    }
    return this.list(l1, l2);
  },
  
  unzip3: function (/* list, ..., list-n */) {
    // returns list(map(car, lists), map(cadr, lists), map(caddr, lists))
    var l1 = null,
        l2 = null,
        l3 = null;
    for (var i=arguments.length-1; i >= 0; i--) {
      l1 = this.cons(arguments[i].car, l1);
      l2 = this.cons(arguments[i].cdr.car, l2);
      l3 = this.cons(arguments[i].cdr.cdr.car, l3);
    }
    return this.list(l1, l2, l3);
  },
  
  unzip4: function (/* list, ..., list-n */) {
    // returns list(map(car, lists), map(cadr, lists), map(caddr, lists), ...)
    var l1 = null,
        l2 = null,
        l3 = null,
        l4 = null;
    for (var i=arguments.length-1; i >= 0; i--) {
      l1 = this.cons(arguments[i].car, l1);
      l2 = this.cons(arguments[i].cdr.car, l2);
      l3 = this.cons(arguments[i].cdr.cdr.car, l3);
      l4 = this.cons(arguments[i].cdr.cdr.cdr.car, l4);
    }
    return this.list(l1, l2, l3, l4);
  },
  
  unzip5: function (/* list, ..., list-n */) {
    // returns list(map(car, lists), map(cadr, lists), map(caddr, lists), ...)
    var l1 = null,
        l2 = null,
        l3 = null,
        l4 = null,
        l5 = null;
    for (var i=arguments.length-1; i >= 0; i--) {
      l1 = this.cons(arguments[i].car, l1);
      l2 = this.cons(arguments[i].cdr.car, l2);
      l3 = this.cons(arguments[i].cdr.cdr.car, l3);
      l4 = this.cons(arguments[i].cdr.cdr.cdr.car, l4);
      l5 = this.cons(arguments[i].cdr.cdr.cdr.cdr.car, l5);
    }
    return this.list(l1, l2, l3, l4, l5);
  },
  
  count: function (pred /* list, ..., list-n */) {
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
  },
  
  
  //________________________________________________________________________//
  // Fold, unfold & map
  //
  // Implemented: map  fold  for_each  map_in_order  filter_map
  //
  // Not yet implemented: unfold  pair-fold  reduce
  //                      fold-right  unfold-right  pair-fold-right
  //                      reduce-right  append-map  append-map!  map!
  //                      pair-for-each
  //________________________________________________________________________//
  
  map: function (fn /* list, ..., list-n */) {
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
          return this.list.apply(this, temp_array);
        }
      }
      temp_array.push(fn.apply(fn, values));
    }
  },
  
  fold: function (kons, nil /* list, ..., list-n */) {
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
  },
  
  for_each: function (fn /* list, ..., list-n */) {
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
  },
  
  map_in_order: function (fn /* list, ..., list-n */) {
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
          return this.list.apply(this, temp_array);
        }
      }
      temp_array.push(fn.apply(fn, values));
    }
  },
  
  filter_map: function (fn /* list, ..., list-n */) {
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
          return this.list.apply(this, temp_array);
        }
      }
      r = fn.apply(fn, values);
      if (r) {
        temp_array.push(r);
      }
    }
  },
  
  
  //________________________________________________________________________//
  // Filtering & partitioning
  //
  // Implemented: filter  partition  remove
  //
  // Not yet implemented: filter!  partition!  remove! //________________________________________________________________________//
  
  filter: function (pred, list) {
    // Return all the elements of list that satisfy predicate pred.
    var l = null;
    while (list !== null) {
      if (pred(list.car)) {
        l = this.cons(list.car, l);
      }
      list = list.cdr;
    }
    return this.reverse(l);
  },
  
  partition: function (pred, list) {
    // Partitions the elements of list with predicate pred, and returns two
    // values: the list of in-elements and the list of out-elements.
    var in_list = null,
        out_list = null;
    while (list !== null) {
      if (pred(list.car)) {
        in_list = this.cons(list.car, in_list);
      }
      else {
        out_list = this.cons(list.car, out_list);
      }
      list = list.cdr;
    }
    return this.cons(this.reverse(in_list), this.reverse(out_list));
  },
  
  remove: function (pred, list) {
    // Returns list without the elements that satisfy predicate pred
    var l = null;
    while (list !== null) {
      if (!pred(list.car)) {
        l = this.cons(list.car, l);
      }
      list = list.cdr;
    }
    return this.reverse(l);
  },
  
  
  //________________________________________________________________________//
  // Searching
  //
  // Implemented: member  find  find-tail  any  every
  //
  // Not yet implemented: memq  memv  list-index  take-while  drop-while
  //                      take-while!  span  break  span!  break!
  //________________________________________________________________________//
  
  member: function (elem, list, fn) {
    // returns the first sublist of list whose car is === to elem.
    // fn is an optional parameter to specify a different equality procedure
    // for example this.list(1, 2) === this.list(1, 2) returns false so an
    // equailty procedure like this.equals is necessary to compare lists.
    fn = (typeof fn === 'undefined') ? function (a, b) { return a === b; } : fn;
    while (list !== null) {
      if (fn(elem, list.car)) {
        return list;
      }
      list = list.cdr;
    }
    return false;
  },
  
  find: function (pred, list) {
    // Return the first element of clist that satisfies predicate pred; 
    // false if no element does. 
    while (list !== null) {
      if (pred(list.car)) {
        return list.car;
      }
      list = list.cdr;
    }
    return false;
  },
  
  find_tail: function (pred, list) {
    // Return the first pair of clist whose car satisfies pred. If no pair
    // does, return false. 
    while (list !== null) {
      if (pred(list.car)) {
        return list;
      }
      list = list.cdr;
    }
    return false;
  },
  
  any: function (pred /* list1, ..., listn */) {
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
  },

  every: function (pred /* list1, ..., listn */) {
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
  },
  
  list_index: function (pred /* list1, ..., listn */) {
    // Applies the predicate across the lists, returning the return value of
    // pred if the predicate returns a truthy value on any application.
    // pred must be a function taking n arguments and returning a boolean
    // result, where n is the number of list arguments passed to any.
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
  },
  
  
  //________________________________________________________________________//
  // Deleting
  //
  // Implemented: delete_elem(delete)
  //
  // Not yet implemented: delete-duplicates  delete!  delete-duplicates!
  //________________________________________________________________________//
  
  delete_elem: function (x, list, eq_fn) {
    // delete_elem uses the comparison function eq_fn, which defaults to ===, 
    // to create a new list without any element equal to x.
    // Renamed from delete because reserved words are not allowed as object 
    // properties in older (< ECMA 5) implementations.
    var tmp_list = null;
    eq_fn = (typeof eq_fn === 'undefined') ? function (a, b) { return a === b; } :
                                                   eq_fn;
    while (list !== null) {
      if (!(eq_fn(x, list.car))) {
        tmp_list = this.cons(list.car, tmp_list);
      }
      list = list.cdr;
    }
    return this.reverse(tmp_list);
  },
  
  
  //________________________________________________________________________//
  // Association lists
  //
  // Implemented: assoc  alist_cons  alist-copy
  //
  // Not yet implemented: assq  assv
  //                      alist-delete  alist-delete!
  //________________________________________________________________________//
  
  assoc: function (key, alist, eq) {
    // alist must be an association list -- a list of pairs. assoc finds the 
    // first pair in alist whose car field is key, and returns that pair. If 
    // no pair in alist has key as its car, then false is returned.
    eq = (typeof eq === 'undefined') ? function (a, b) { return a === b; } :
                                       eq;
    while (alist !== null) {
      if (eq(key, alist.car.car)) {
        return alist.car;
      }
      alist = alist.cdr;
    }
    return false;
  },
  
  alist_cons: function (key, value, alist) {
    // Cons a new alist entry mapping key -> value onto alist.
    return this.cons(this.cons(key, value), alist);
  },
  
  alist_copy: function (alist) {
    if (alist instanceof this.Pair) {
      return this.cons(this.cons(alist.car.car, alist.car.cdr),
                       this.list_copy(alist.cdr));
    }
    else {
      return alist;
    }

  },
  
  
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
  
  lset_union: function (eq, a, b) {
    var r = this.list_copy(a);
    while (b !== null) {
      if (!this.member(b.car, a, eq)) {
        r = this.cons(b.car, r);
      }
      b = b.cdr;
    }
    return r;
  },
  
  
  //________________________________________________________________________//
  // Primitive side-effects
  //
  // Implemented: set_car  set_cdr
  //________________________________________________________________________//
  
  set_car: function (list, val) {
    list.car = val;
  },
  
  set_cdr: function (list, val) {
    list.cdr = val;
  },
  
  
  //________________________________________________________________________//
  // Implementation specific helper functions (not in srfi-1)
  //
  // Implemented: to_array  to_string
  //________________________________________________________________________//
  
  to_array: function (list) {
    // Converts list to a Javascript array
    var a = [];
    while (list !== null) {
      a.push(list.car);
      list = list.cdr;
    }
    return a;
  },
  
  to_string: function (list) {
    // Return a string representation of list
    var s = "(";
    while (list !== null) {
      if (list.car instanceof this.Pair) {
        s += this.to_string(list.car);
        if (list.cdr !== null) { s += " "; }
      }
      else {
        s += list.car;
        if (list.cdr !== null) { s += " "; }
      }
      list = list.cdr;
    }
    return s + ")";
  },
  
  array_to_list: function (a) {
    return this.list.apply(this, a);
  }

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
  // srfi1.circular_list
  //________________________________________________________________________//

  current_method = "circular_list";
  counter = 0;
  
  // 0
  t(s.circular_list(0, 1).cdr.cdr.car,
    0);
  
  // 1 - circular list of length 1
  t(s.circular_list(1).cdr.cdr.car,
    1);
  

  //________________________________________________________________________//
  // srfi1.iota
  //________________________________________________________________________//

  current_method = "iota";
  counter = 0;
  
  // 0 - 1 argument
  t(s.iota(3),
    s.list(0, 1, 2));
  
  // 1 - start and stop arguments from 0
  t(s.iota(0, 3),
    s.list(0, 1, 2));
  
  // 2 - start and stop arguments from 2
  t(s.iota(2, 3),
    s.list(2, 3, 4));
  
  // 3 - start, stop and step arguments
  t(s.iota(1, 0.3, 0.1),
    s.list(1, 1.1, 1.2));
  
  
  //________________________________________________________________________//
  // srfi1.is_pair and srfi1.not_pair
  //________________________________________________________________________//

  current_method = "is_pair";
  counter = 0;
  
  // 0 - pair
  t(s.is_pair(s.cons(1, 2)),
    true);
  
  // 1 - list
  t(s.is_pair(s.list(1, 2, 3)),
    true);
  
  // 2 - null
  t(s.is_pair(null),
    false);
  
  // 3 - integer
  t(s.is_pair(42),
    false);
  
  // 4 - pair
  t(s.not_pair(s.cons(1, 2)),
    false);
  
  // 5 - list
  t(s.not_pair(s.list(1, 2, 3)),
    false);
  
  // 6 - null
  t(s.not_pair(null),
    true);
  
  // 7 - integer
  t(s.not_pair(42),
    true);
  
  
  //________________________________________________________________________//
  // srfi1.is_null
  //________________________________________________________________________//

  current_method = "is_null";
  counter = 0;
  
  // 0 - null
  t(s.is_null(null),
    true);
  
  // 1 - pair
  t(s.is_null(s.cons(1, 2)),
    false);
  
  
  //________________________________________________________________________//
  // srfi1.is_proper_list
  //________________________________________________________________________//

  current_method = "is_proper_list";
  counter = 0;
  
  // 0 - empty list is a proper list
  t(s.is_proper_list(null),
    true);
  
  // 1 - dotted list
  t(s.is_proper_list(s.cons(1, 2)),
    false);
  
  // 2 - proper list
  t(s.is_proper_list(s.list(1, 2, 3)),
    true);
  
  // 3 - improper list
  t(s.is_proper_list(s.cons(1, s.cons(2, 3))),
    false);
  
  // 4 - circular_list
  t(s.is_proper_list(s.circular_list(1, 2, 3)),
    false);
  
  
  //________________________________________________________________________//
  // srfi1.is_circular_list
  //________________________________________________________________________//

  current_method = "is_circular_list";
  counter = 0;
  
  // 0 - empty list is not a circular list
  t(s.is_circular_list(null),
    false);
  
  // 1 - cons cells are not circular lists
  t(s.is_circular_list(s.cons(1, 2)),
    false);
  
  // 2 - proper lists are not circular lists
  t(s.is_circular_list(s.list(1)),
    false);
  
  // 3 - circular lists are circular lists
  t(s.is_circular_list(s.circular_list(0, 1, 2)),
    true);
  
  
  //________________________________________________________________________//
  // srfi1.is_dotted_list
  //________________________________________________________________________//

  current_method = "is_dotted_list";
  counter = 0;
  
  // 0 - empty list is not a dotted list
  t(s.is_dotted_list(null),
    false);
  
  // 1 - proper list of length 1 is not a dotted list
  t(s.is_dotted_list(s.list(1)),
    false);
  
  // 2 - proper list is not a dotted list
  t(s.is_dotted_list(s.list(1, 2, 3)),
    false);
  
  // 3 - circular list is not dotted list
  t(s.is_dotted_list(s.circular_list(1)),
    false);
  
  // 4 - pair whose cdr is not a list is a dotted list
  t(s.is_dotted_list(s.cons(1, 2)),
    true);
  
  // 5 - improper lists are dotted lists
  t(s.is_dotted_list(s.cons(1, s.cons(2, 3))),
    true);
  
  
  
  //________________________________________________________________________//
  // srfi1.is_dotted_list
  //________________________________________________________________________//

  current_method = "is_dotted_list";
  counter = 0;
  
  // 0 - null is the only value for which this function will return true
  t(s.is_null_list(null),
    true);
  
  // 1 - list
  t(s.is_null_list(s.list(1, 2, 3)),
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
  
  
  //________________________________________________________________________//
  // srfi1.take
  //________________________________________________________________________//

  current_method = "take";
  counter = 0;
  
  // 0
  t(s.take(s.list(1, 2, 3, 4), 2),
    s.list(1, 2));
  
  // 1 - take with n = 0
  t(s.take(s.list(1, 2, 3, 4), 0),
    null);
  
  // 2 - take with n = list length
  t(s.take(s.list(1, 2, 3, 4), 4),
    s.list(1, 2, 3, 4));
  
  
  //________________________________________________________________________//
  // srfi1.drop
  //________________________________________________________________________//

  current_method = "drop";
  counter = 0;
  
  // 0
  t(s.drop(s.list(1, 2, 3, 4), 2),
    s.list(3, 4));
  
  // 1 - drop with n = 0
  t(s.drop(s.list(1, 2, 3, 4), 0),
    s.list(1, 2, 3, 4));
  
  // 2 - drop with n = list length
  t(s.drop(s.list(1, 2, 3, 4), 4),
    null);
  
  
  //________________________________________________________________________//
  // srfi1.take_right
  //________________________________________________________________________//

  current_method = "take_right";
  counter = 0;
  
  // 0
  t(s.take_right(s.list(1, 2, 3, 4), 2),
    s.list(3, 4));
  
  
  //________________________________________________________________________//
  // srfi1.drop_right
  //________________________________________________________________________//

  current_method = "drop_right";
  counter = 0;
  
  // 0
  t(s.drop_right(s.list(1, 2, 3, 4), 2),
    s.list(1, 2));
  
  
  //________________________________________________________________________//
  // srfi1.split_at
  //________________________________________________________________________//

  current_method = "split_at";
  counter = 0;
  
  // 0
  t(s.split_at(s.list(1, 2, 3, 4), 2),
    s.cons(s.list(1, 2), s.list(3, 4)));
    
  
  //________________________________________________________________________//
  // srfi1.last
  //________________________________________________________________________//

  current_method = "last";
  counter = 0;
  
  // 0
  t(s.last(s.list(1, 2, 3)),
    3);
  
  
  //________________________________________________________________________//
  // srfi1.last_pair
  //________________________________________________________________________//

  current_method = "last_pair";
  counter = 0;
  
  // 0
  t(s.last_pair(s.list(1, 2, 3)),
    s.cons(3, null));
  
  
  //________________________________________________________________________//
  // srfi1.length
  //________________________________________________________________________//

  current_method = "length";
  counter = 0;
  
  // 0
  t(s.length(s.list(0, 1, 2)),
    3);
  
  // 1 - length of the empty list
  t(s.length(null),
    0);
  
  // 2 - length of a pair
  t(s.length(s.cons(1, 2)),
    1);
  
  // 3 - length of an improper list
  t(s.length(s.cons(1, s.cons(2, 3))),
    2);
  
  
  //________________________________________________________________________//
  // srfi1.length_plus
  //________________________________________________________________________//

  current_method = "length_plus";
  counter = 0;
  
  // 0 - the empty list
  t(s.length_plus(null),
    0);
  
  // 1 - list of length 3
  t(s.length_plus(s.list(1, 2, 3)),
    3);
  
  // 2 - length of a pair
  t(s.length_plus(s.cons(1, 2)),
    1);
  
  // 3 - length of an improper list
  t(s.length_plus(s.cons(1, s.cons(2, 3))),
    2);
  
  // 4 - length of a circular list
  t(s.length_plus(s.circular_list(1)),
    false);
  
  
  //________________________________________________________________________//
  // srfi1.length_circular
  //________________________________________________________________________//

  current_method = "length_circular";
  counter = 0;
  
  // 0 - the empty list
  t(s.length_circular(null),
    0);
  
  // 1 - list of length 3
  t(s.length_circular(s.list(1, 2, 3)),
    3);
  
  // 2 - length of a pair
  t(s.length_circular(s.cons(1, 2)),
    1);
  
  // 3 - length of an improper list
  t(s.length_circular(s.cons(1, s.cons(2, 3))),
    2);
  
  // 4 - length of a circular list
  t(s.length_circular(s.circular_list(1)),
    1);
  
  // 5 - length of a circular list
  t(s.length_circular(s.circular_list(1, 2, 3)),
    3);
  
  
  //________________________________________________________________________//
  // srfi1.append
  //________________________________________________________________________//

  current_method = "append";
  counter = 0;
  
  // 0 - append 2 lists
  t(s.append(s.list(1, 2), s.list(3, 4)),
    s.list(1, 2, 3, 4));
  
  // 1 - append 3 lists
  t(s.append(s.list(1, 2), s.list(3, 4), s.list(5, 6)),
    s.list(1, 2, 3, 4, 5, 6));
  
  // 2 - append 2 lists and an atom (should return an improper list)
  t(s.append(s.list(1), s.list(2), 3),
    s.cons(1, s.cons(2, 3)));
  
  
  //________________________________________________________________________//
  // srfi1.concatenate
  //________________________________________________________________________//

  current_method = "concatenate";
  counter = 0;
  
  // 0 - concatenate 2 lists
  t(s.concatenate(s.list(s.list(1, 2), s.list(3, 4))),
    s.list(1, 2, 3, 4));
  
  // 1 - concatenate 3 lists
  t(s.concatenate(s.list(s.list(1, 2), s.list(3, 4), s.list(5, 6))),
    s.list(1, 2, 3, 4, 5, 6));
  
  // 2 - concatenate with an empty list
  t(s.concatenate(s.list(s.list(1, 2), null, s.list(3, 4))),
    s.list(1, 2, 3, 4));
  
  
  //________________________________________________________________________//
  // srfi1.reverse
  //________________________________________________________________________//

  current_method = "reverse";
  counter = 0;
  
  // 0
  t(s.reverse(s.list(1, 2, 3)),
    s.list(3, 2, 1));
  
  
  //________________________________________________________________________//
  // srfi1.append_reverse
  //________________________________________________________________________//

  current_method = "append_reverse";
  counter = 0;
  
  // 0
  t(s.append_reverse(s.list(1, 2, 3), s.list(4, 5, 6)),
    s.list(3, 2, 1, 4, 5, 6));
  
  
  //________________________________________________________________________//
  // srfi1.zip
  //________________________________________________________________________//

  current_method = "zip";
  counter = 0;
  
  // 0 - zip 2 equal length lists
  t(s.zip(s.list(1, 2), s.list(3, 4)),
    s.list(s.list(1, 3), s.list(2, 4)));
  
  // 1 - zip 2 unequal length lists
  t(s.zip(s.list(1, 2, 5), s.list(3, 4)),
    s.list(s.list(1, 3), s.list(2, 4)));

  // 2 - zip 2 unequal length lists
  t(s.zip(s.list(1, 2), s.list(3, 4, 5)),
    s.list(s.list(1, 3), s.list(2, 4)));

  
  //________________________________________________________________________//
  // srfi1.unzip1
  //________________________________________________________________________//

  current_method = "unzip1";
  counter = 0;
  
  // 0
  t(s.unzip1(s.list(1, 2), s.list(3, 4)),
    s.list(1, 3));

  
  //________________________________________________________________________//
  // srfi1.unzip2
  //________________________________________________________________________//

  current_method = "unzip2";
  counter = 0;
  
  // 0
  t(s.unzip2(s.list(1, 2), s.list(3, 4)),
    s.list(s.list(1, 3), s.list(2, 4)));

  
  //________________________________________________________________________//
  // srfi1.unzip3
  //________________________________________________________________________//

  current_method = "unzip3";
  counter = 0;
  
  // 0
  t(s.unzip3(s.list(1, 2, 3), s.list(4, 5, 6)),
    s.list(s.list(1, 4), s.list(2, 5), s.list(3, 6)));

  
  //________________________________________________________________________//
  // srfi1.unzip4
  //________________________________________________________________________//

  current_method = "unzip4";
  counter = 0;
  
  // 0
  t(s.unzip4(s.list(1, 2, 3, 4), s.list(5, 6, 7, 8)),
    s.list(s.list(1, 5), s.list(2, 6), s.list(3, 7), s.list(4, 8)));

  
  //________________________________________________________________________//
  // srfi1.unzip5
  //________________________________________________________________________//

  current_method = "unzip5";
  counter = 0;
  
  // 0
  t(s.unzip5(s.list(1, 2, 3, 4, 5), s.list(6, 7, 8, 9, 10)),
    s.list(s.list(1, 6), s.list(2, 7), s.list(3, 8), s.list(4, 9), s.list(5, 10)));

  
  //________________________________________________________________________//
  // srfi1.count
  //________________________________________________________________________//

  current_method = "count";
  counter = 0;
  
  // 0 - 1 argument
  t(s.count(function (x) { return x < 3; }, s.list(1, 2, 3, 4)),
    2);
  
  // 1 - 2 arguments
  t(s.count(function (x, y) { return x < y; }, s.list(1, 3, 7), s.list(2, 4, 6)),
    2);
  
  
  //________________________________________________________________________//
  // srfi1.map
  //________________________________________________________________________//

  current_method = "map";
  counter = 0;
  
  // 0 - add 1 to each element of list
  t(s.map(function (x) { return x+1; }, s.list(1, 2, 3)),
    s.list(2, 3, 4));
  
  // 1 - map with 2 lists
  t(s.map(function (x, y) { return x+y; },
           s.list(1, 2, 3),
           s.list(3, 4, 5)),
    s.list(4, 6, 8));
  
  // 2 - map with unequal length lists
  t(s.map(function (x, y) { return x+y; },
           s.list(1, 2, 3, 4),
           s.list(3, 4, 5)),
    s.list(4, 6, 8));
  
  // 3 - map with unequal length lists
  t(s.map(function (x, y) { return x+y; },
           s.list(1, 2, 3),
           s.list(3, 4, 5, 6)),
    s.list(4, 6, 8));
  
  // 4 - map with 3 lists
  t(s.map(function (x, y, z) { return x+y+z; },
           s.list(1, 2, 3, 10),
           s.list(3, 4, 5),
           s.list(3, 2, 1, 20, 30)),
    s.list(7, 8, 9));

  
  //________________________________________________________________________//
  // srfi1.fold
  //________________________________________________________________________//

  current_method = "fold";
  counter = 0;
  
  // 0 - add
  t(s.fold(function (a, b) { return a + b; },
           0,
           s.list(1, 2, 3)),
    6);
  
  // 1 - cons (reverse list)
  t(s.fold(function (a, b) { return s.cons(a, b); },
           null,
           s.list(1, 2, 3)),
    s.list(3, 2, 1));
  
  // 2 - add and cons
  t(s.fold(function (a, b, c) { return s.cons(a+b, c); },
           null,
           s.list(1, 2, 3),
           s.list(4, 5, 6)),
    s.list(5, 7, 9));

  
  //________________________________________________________________________//
  // srfi1.for_each
  //________________________________________________________________________//

  (function () {
    var a = [],
        list = s.list(1, 2, 3);
    
    s.for_each(function (x) { a.push(x); }, list);
    
    if (a<[1, 2, 3] || [1, 2, 3]<a) {
      console.log("Test Failed! for_each");
    }
  })();

  
  //________________________________________________________________________//
  // srfi1.map_in_order
  //________________________________________________________________________//

  (function () {
    var a = [],
        list = s.list(1, 2, 3),
        r;
    
    r = s.map_in_order(function (x) { a.push(x); return x+1; }, list);
    
    if ( (a<[1, 2, 3] || [1, 2, 3]<a) || !s.equal(r, s.list(2, 3, 4)) ) {
      console.log("Test Failed! map_in_order");
    }
  })();

  
  //________________________________________________________________________//
  // srfi1.filter_map
  //________________________________________________________________________//

  current_method = "filter_map";
  counter = 0;
  
  // 0
  t(s.filter_map(function (x) { return x < 5 && x + 1; }, s.list(1, 3, 5, 7)),
    s.list(2, 4));
  
  
  
  //________________________________________________________________________//
  // srfi1.filter
  //________________________________________________________________________//

  current_method = "filter";
  counter = 0;
  
  // 0 - return list of values less than 3
  t(s.filter(function (x) { return x < 3; }, s.list(1, 2, 3, 4)),
    s.list(1, 2));
  
  
  //________________________________________________________________________//
  // srfi1.partition
  //________________________________________________________________________//

  current_method = "partition";
  counter = 0;
  
  // 0 - partition on even?
  t(s.partition(function (x) { return (x % 2) === 0; }, s.list(1, 2, 3, 4)),
    s.cons(s.list(2, 4), s.list(1, 3)));
  
  
  //________________________________________________________________________//
  // srfi1.remove
  //________________________________________________________________________//

  current_method = "remove";
  counter = 0;
  
  // 0 - remove < 3
  t(s.remove(function (x) { return x < 3; }, s.list(1, 2, 3, 4)),
    s.list(3, 4));
  
  
  //________________________________________________________________________//
  // srfi1.member
  //________________________________________________________________________//

  current_method = "member";
  counter = 0;
  
  // 0 - is 2 in (1 2 3)
  t(s.member(2, s.list(1, 2, 3)),
    s.list(2, 3));
  
  // 1 - is 5 in (1 2 3)
  t(s.member(5, s.list(1, 2, 3)),
    false);
  
  // 2 - using optional equality procedure (subtract 2 from elem and compare)
  t(s.member(5, s.list(1, 2, 3), function (x, y) { return (x-3) === y; }),
    s.list(2, 3));
  
  
  //________________________________________________________________________//
  // srfi1.find
  //________________________________________________________________________//

  current_method = "find";
  counter = 0;
  
  // 0 - even number in (1 2 3)
  t(s.find(function (x) { return x % 2 === 0; }, s.list(1, 2, 3)),
    2);
  
  // 1 - even number in (1 3 5)
  t(s.find(function (x) { return x % 2 === 0; }, s.list(1, 3, 5)),
    false);
  
  
  //________________________________________________________________________//
  // srfi1.find_tail
  //________________________________________________________________________//

  current_method = "find_tail";
  counter = 0;
  
  // 0 - even number in (1 2 3)
  t(s.find_tail(function (x) { return x % 2 === 0; }, s.list(1, 2, 3)),
    s.list(2, 3));
  
  // 1 - even number in (1 3 5)
  t(s.find_tail(function (x) { return x % 2 === 0; }, s.list(1, 3, 5)),
    false);
  
  
  //________________________________________________________________________//
  // srfi1.any
  //________________________________________________________________________//

  current_method = "any";
  counter = 0;
  
  // 0 - any even?
  t(s.any(function (x) { return x % 2 === 0; }, s.list(1, 2, 3)),
    true);
  
  // 1 - any even?
  t(s.any(function (x) { return x % 2 === 0; }, s.list(1, 3, 5)),
    false);
  
  // 2 - any with 2 lists
  t(s.any(function (x, y) { return x === y; },
          s.list(1, 2, 3),
          s.list(3, 2, 1)),
    true);
  
  // 3 - any with 2 lists
  t(s.any(function (x, y) { return x === y; },
          s.list(1, 2, 3),
          s.list(2, 3, 1)),
    false);
  
  // 4 - any return value
  t(s.any(function (x) { if (x % 2 === 0) { return x; } },
          s.list(1, 2, 3, 4, 5)),
    2);

  
  //________________________________________________________________________//
  // srfi1.every
  //________________________________________________________________________//

  current_method = "every";
  counter = 0;
  
  // 0 - every > 0
  t(s.every(function (x) { return x > 0; }, s.list(1, 2, 3)),
    true);
  
  // 1 - every > 0
  t(s.every(function (x) { return x > 0; }, s.list(1, -2, 3)),
    false);
  
  // 2 - every with 2 lists
  t(s.every(function (x, y) { return x > 0 && y > 0; },
            s.list(1, 2, 3),
            s.list(4, 5, 6)),
    true);
  
  // 3 - every with 2 lists
  t(s.every(function (x, y) { return x > 0 && y > 0; },
            s.list(1, 2, 3),
            s.list(4, -5, 6)),
    false);

  // 4 - every return value
  t(s.every(function (x) { if (x > 0) { return x; } }, s.list(1, 2, 3)),
    3);

  
  //________________________________________________________________________//
  // srfi1.list_index
  //________________________________________________________________________//

  current_method = "list_index";
  counter = 0;
  
  // 0 - single list
  t(s.list_index(function (x) { return x === 2; },
                 s.list(1, 2, 3)),
    1);

  // 1 - not in list
  t(s.list_index(function (x) { return x === 6; },
                 s.list(1, 2, 3)),
    false);
  
  // 1 - 2 lists
  t(s.list_index(function (x, y) { return x === y; },
                 s.list(1, 2, 3),
                 s.list(3, 2, 1)),
    1);
  
  
  //________________________________________________________________________//
  // srfi1.delete_elem
  //________________________________________________________________________//

  current_method = "delete_elem";
  counter = 0;
  
  // 0
  t(s.delete_elem(2, s.list(1, 2, 3)),
    s.list(1, 3));
  
  // 1 - with custom equality function
  t(s.delete_elem(1, s.list(1, 2, 3), function (a, b) { return a+1 === b; }),
    s.list(1, 3));

  
  //________________________________________________________________________//
  // srfi1.assoc
  //________________________________________________________________________//

  current_method = "assoc";
  counter = 0;
  
  // 0
  t(s.assoc(2, s.list(s.cons(1, 4), s.cons(2, 5), s.cons(3, 6))),
    s.cons(2, 5));
  
  // 1 - not found
  t(s.assoc(5, s.list(s.cons(1, 4), s.cons(2, 5), s.cons(3, 6))),
    false);
  
  // 2 - custom equality function
  t(s.assoc(2, s.list(s.cons(1, 4), s.cons(2, 5), s.cons(3, 6)),
            function (a, b) { return a+1 === b; }),
    s.cons(2, 5));

  
  //________________________________________________________________________//
  // srfi1.alist_cons
  //________________________________________________________________________//

  current_method = "alist_cons";
  counter = 0;
  
  // 0
  t(s.alist_cons(3, 6, s.list(s.cons(1, 4), s.cons(2, 5))),
    s.list(s.cons(3, 6), s.cons(1, 4), s.cons(2, 5)));

  
  //________________________________________________________________________//
  // srfi1.alist_copy
  //________________________________________________________________________//

  current_method = "alist_copy";
  counter = 0;
  
  // 0
  t(s.alist_copy(s.list(s.cons(1, 3), s.cons(2, 4))),
    s.list(s.cons(1, 3), s.cons(2, 4)));
  
  
  //________________________________________________________________________//
  // srfi1.lset_union
  //________________________________________________________________________//

  current_method = "lset_union";
  counter = 0;
  
  // 0
  t(s.lset_union(function (a, b) { return a === b; },
                 s.list(1, 2, 3),
                 s.list(2, 3, 4, 5)),
    s.list(5, 4, 1, 2, 3));
  
  
  
  
  
  
  
  
  
  
  
  
  
  //________________________________________________________________________//
  // srfi1.to_array
  //________________________________________________________________________//

  (function () {
    var a = s.to_array(s.list(1, 2, 3)),
        b = [1, 2, 3];
    if (a<b || b<a) {
      console.log("Test Failed! to_array");
    }
  })();
  
  
  //________________________________________________________________________//
  // srfi1.to_string
  //________________________________________________________________________//
  
  if (s.to_string(s.list(1, 2, 3)) !== "(1 2 3)") {
    console.log("Test Failed! to_string");
  }
  
  
  //________________________________________________________________________//
  // srfi1.array_to_list
  //________________________________________________________________________//
  
  t(s.array_to_list([1, 2, 3]),
    s.list(1, 2, 3));



  console.log("Tests completed!");
  counter = 0;
  for(var i in srfi1) {
    if (srfi1.hasOwnProperty(i)) {
      counter += 1;
    }
  }
  return counter + " functions implemented";

})();
