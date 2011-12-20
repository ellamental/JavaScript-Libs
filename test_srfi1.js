$(document).ready(function(){
  var s = srfi1;
  
  module("srfi1.js");
  
  test("Pair constructor", function () {
    var p = new srfi1.Pair(1, 2);
    
    ok( p instanceof srfi1.Pair,
        "p is an instance of srfi1.Pair" );
    
    equal( p.car,
           1,
           "p.car === 1" );
    
    equal( p.cdr,
           2,
           "p.cdr === 2" );
  });
  
  
  test("is_equal", function () {
    equal( s.is_equal( 7, 42 ),
      false);
    
    equal( s.is_equal( "a", "b" ),
           false,
           "'a' === 'b'" );
    
    equal( s.is_equal( s.cons(1, 2),
                       s.cons(1, 3) ),
           false,
           "(1 2) === (1 3)" );
    
    equal( s.is_equal( s.cons(1, 2),
                       s.cons(3, 4) ),
           false,
           "(1 2) === (3 4)" );
    
    equal( s.is_equal( s.cons(1, null),
                       s.cons(2, null) ),
           false,
           "(1) === (2)" );
    
    equal( s.is_equal( s.cons(1, s.cons(2, 3)),
                       s.cons(1, s.cons(2, 4)) ),
           false,
           "(1 (2 3)) === (1 (2 4))" );
    
    equal( s.is_equal( s.cons(1, s.cons(2, null)),
                       s.cons(1, s.cons(3, null)) ),
           false,
           "(1 (2)) === (1 (3))" );
    
    equal( s.is_equal( [1, 2, 3],
                       [1, 2, 4] ),
           false,
           "[1, 2, 3] === [1, 2, 4]" );
    
    equal( s.is_equal( s.cons([1, 2], [3, 4]),
                       s.cons([1, 2], [4, 3]) ),
           false,
           "([1, 2] [3, 4]) === ([1, 2] [4, 3])" );
    
    equal( s.is_equal( [s.cons(1, 2)],
                       [s.cons(1, 2)] ),
           true,
           "[(1 2)] === [(1 2)]" );
    
    equal( s.is_equal( [1, 2, 3],
                       [1, 2, 3] ),
           true,
           "[1, 2, 3] === [1, 2, 3]" );
    
    equal( s.is_equal( s.cons([1, 2], [3, 4]),
                       s.cons([1, 2], [3, 4]) ),
           true,
           "([1, 2] [3, 4]) === ([1, 2] [3, 4])" );
    
    equal( s.is_equal( [s.cons(1, 2)],
                       [s.cons(1, 2)] ),
           true,
           "[(1 2)] === [(1 2)]" );
    
    equal( s.is_equal( s.cons(1, s.cons(2, s.cons(3, null))), 
                       s.cons(1, s.cons(2, s.cons(3, null))) ),
           true,
           "(1 2 3) === (1 2 3)" );
    
    equal( s.is_equal( [s.cons(1, [s.cons(2, [s.cons(3, 4)])])],
                       [s.cons(1, [s.cons(2, [s.cons(3, 4)])])] ),
           true,
           "Deep equality lots of nested Arrays and Pairs" );
  });
  
  
  test("cons", function () {
    deepEqual( s.cons(1, 2),
               new s.Pair(1, 2),
               "cons two integers" );
    
    deepEqual( s.cons(1, null),
               new s.Pair(1, null),
               "make a proper list of length 1" );
    
    deepEqual( s.cons(1, s.cons(2, null)),
               new s.Pair(1, new s.Pair(2, null)),
               "make a proper list of length 2" );
    
    deepEqual( s.cons(s.cons(1, 2), null),
               new s.Pair(new s.Pair(1, 2), null),
               "make list of length 1 with an improper nested list" );
    
    deepEqual( s.cons(s.cons(1, null), null),
               new s.Pair(new s.Pair(1, null), null),
               "make a list of length 1 with a proper nested list" );
    
    deepEqual( s.cons(1, s.cons(2, 3)),
               new s.Pair(1, new s.Pair(2, 3)),
               "make a list of length 2 with an improper list in the cdr" );
    
    deepEqual( s.cons(s.cons(1, 2), s.cons(3, 4)),
               new s.Pair(new s.Pair(1, 2), new s.Pair(3, 4)),
               "make a list of length 2 with improper lists in both car and cdr" );
  });
  
  
  test("list", function () {
    deepEqual( s.list(),
               null,
               "list with no arguments" );
    
    deepEqual( s.list(1),
               s.cons(1, null),
               "list of length 1" );
    
    deepEqual( s.list(1, 2),
               s.cons(1, s.cons(2, null)),
               "list of length 2" );
    
    deepEqual( s.list( s.list(1), 2 ),
               s.cons(s.cons(1, null), s.cons(2, null)),
               "list with embedded list" );
  });
  
  
  test("xcons", function () {
    deepEqual( s.xcons(2, 1),
               s.cons(1, 2),
               "pair" );
    
    deepEqual( s.xcons(s.list(2, 3), 1),
               s.list(1, 2, 3),
               "proper list" );
  });
  
  
  test("cons_list", function () {
    deepEqual( s.cons_list(1, 2, 3),
               s.cons(1, s.cons(2, 3)),
               "(1 2 . 3)" );
    
    deepEqual( s.cons_list(1, 2),
               s.cons(1, 2),
               "(1 . 2)" );
    
    // s.cons_list(1) should error instead of returning (1, undefined)
  });
  
  
  test("make_list", function () {
    deepEqual( s.make_list(3, 1),
               s.list(1, 1, 1),
               "(1 1 1)" );
    
    deepEqual( s.make_list(),
               null,
               "no arguments" );

  });
  
  
  test("list_tabulate", function () {
    deepEqual( s.list_tabulate(3, function (i) { return i; }),
               s.list(0, 1, 2),
               "(0 1 2)" );

  });
  
  
  test("list_copy", function () {
    deepEqual( s.list_copy(s.list(1, 2, 3)),
               s.list(1, 2, 3),
               "copy a proper list" );
    
    deepEqual( s.list_copy(s.cons(1, 2)),
               s.cons(1, 2),
               "copy a pair" );
    
    deepEqual( s.list_copy(s.cons(1, s.cons(2, 3))),
               s.cons(1, s.cons(2, 3)),
               "copy an improper list" );

  });
  
  
  test("circular_list", function () {
    deepEqual( s.circular_list(0, 1).cdr.cdr.car,
               0,
               "(0 1)" );
    
    deepEqual( s.circular_list(1).cdr.cdr.car,
               1,
               "circular list of length 1" );
  });
  
  
  test("iota", function () {
    deepEqual( s.iota(3),
               s.list(0, 1, 2),
               "single argument" );
    
    deepEqual( s.iota(0, 3),
               s.list(0, 1, 2),
               "start and stop arguments from 0" );
    
    deepEqual( s.iota(2, 3),
               s.list(2, 3, 4),
               "start and stop arguments from 2" );
    
    // 1.2 !== 1.1+0.1 so we need to do the math to test for equality
    deepEqual( s.iota(1, 0.3, 0.1),
               s.list(1, 1+0.1, 1.1+0.1),
               "start, stop and step arguments" );
  });
  
  
  test("is_pair", function () {
    deepEqual( s.is_pair(s.cons(1, 2)),
               true,
               "pair" );
    
    deepEqual( s.is_pair(s.list(1, 2, 3)),
               true,
               "list" );
    
    deepEqual( s.is_pair(null),
               false,
               "null" );
    
    deepEqual( s.is_pair(42),
               false,
               "integer" );
    
    deepEqual( s.not_pair(s.cons(1, 2)),
               false,
               "pair" );
    
    deepEqual( s.not_pair(s.list(1, 2, 3)),
               false,
               "list" );
    
    deepEqual( s.not_pair(null),
               true,
               "null" );
    
    deepEqual( s.not_pair(42),
               true,
               "integer" );
  });
  
  
  test("is_null", function () {
    deepEqual( s.is_null(null),
               true,
               "null" );
    
    deepEqual( s.is_null(s.cons(1, 2)),
               false,
               "pair" );
  });
  
  
  test("is_proper_list", function () {
    deepEqual( s.is_proper_list(null),
               true,
               "empty list is a proper list" );
    
    deepEqual( s.is_proper_list( s.cons(1, 2) ),
               false,
               "dotted list" );
    
    deepEqual( s.is_proper_list( s.list(1, 2, 3) ),
               true,
               "proper list" );
    
    deepEqual( s.is_proper_list( s.cons(1, s.cons(2, 3)) ),
               false,
               "improper list" );
    
    deepEqual( s.is_proper_list( s.circular_list(1, 2, 3) ),
               false,
               "circular_list" );
  });
  
  
  test("is_circular_list", function () {
    deepEqual( s.is_circular_list(null),
               false,
               "empty list is not a circular list" );
    
    deepEqual( s.is_circular_list( s.cons(1, 2) ),
               false,
               "cons cells are not circular lists" );
    
    deepEqual( s.is_circular_list( s.list(1) ),
               false,
               "proper lists are not circular lists" );
    
    deepEqual( s.is_circular_list( s.circular_list(0, 1, 2) ),
               true,
               "circular lists are circular lists" );
  });
  
  
  test("is_dotted_list", function () {
    deepEqual( s.is_dotted_list(null),
               false,
               "empty list is not a dotted list" );
    
    deepEqual( s.is_dotted_list(s.list(1)),
               false,
               "proper list of length 1 is not a dotted list" );
    
    deepEqual( s.is_dotted_list(s.list(1, 2, 3)),
               false,
               "proper list is not a dotted list" );
    
    deepEqual( s.is_dotted_list(s.circular_list(1)),
               false,
               "circular list is not dotted list" );
    
    deepEqual( s.is_dotted_list(s.cons(1, 2)),
               true,
               "pair whose cdr is not a list is a dotted list" );
    
    deepEqual( s.is_dotted_list(s.cons(1, s.cons(2, 3))),
               true,
               "improper lists are dotted lists" );
  });
  
  
  test("is_null_list", function () {
    deepEqual( s.is_null_list(null),
               true,
               "null is the only value for which this function will return true" );
    
    deepEqual( s.is_null_list(s.list(1, 2, 3)),
               false,
               "list" );
  });
  
  
  test("car and first", function () {
    deepEqual( s.car(s.cons(1, 2)),
               1,
               "pair" );
    
    deepEqual( s.car(s.list(1, 2, 3)),
               1,
               "list" );
    
    deepEqual( s.car(s.list(s.cons(1, 2), 3)),
               s.cons(1, 2),
               "embedded pair" );
    
    deepEqual( s.first(s.list(1, 2, 3)),
               1,
               "list" );
  });
  
  
  test("cdr and rest", function () {
    deepEqual( s.cdr(s.cons(1, 2)),
               2,
               "pair" );
    
    deepEqual( s.cdr(s.cons(1, null)),
               null,
               "1 element list" );
    
    deepEqual( s.cdr(s.list(1, 2, 3)),
               s.list(2, 3),
               "3 element list" );
    
    deepEqual( s.rest(s.list(1, 2, 3)),
               s.list(2, 3),
               "rest: 3 element list" );
  });
  
  
  test("c...r", function () {
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
    
    deepEqual( s.caar(crlist),
               s.list(1, 2, 3),
               "caar" );
    deepEqual( s.cadr(crlist),
               s.list(s.list(10, 11, 12), s.list(13, 14, 15), s.list(16, 17, 18)),
               "cadr" );
    deepEqual( s.cdar(crlist),
               s.list(s.list(4, 5, 6), s.list(7, 8, 9)),
               "cdar" );
    deepEqual( s.cddr(crlist),
               s.list(s.list(s.list(19, 20, 21), s.list(22, 23, 24), s.list(25, 26, 27))),
               "cddr" );

    deepEqual( s.caaar(crlist),
               1,
               "caaar" );
    deepEqual( s.caadr(crlist),
               s.list(10, 11, 12),
               "caadr" );
    deepEqual( s.cadar(crlist),
               s.list(4, 5, 6),
               "cadar" );
    deepEqual( s.caddr(crlist),
               s.list(s.list(19, 20, 21), s.list(22, 23, 24), s.list(25, 26, 27)),
               "caddr" );
    deepEqual( s.cdaar(crlist),
               s.list(2, 3),
               "cdaar" );
    deepEqual( s.cdadr(crlist),
               s.list(s.list(13, 14, 15), s.list(16, 17, 18)),
               "cdadr" );
    deepEqual( s.cddar(crlist),
               s.list(s.list(7, 8, 9)),
               "cddar" );
    deepEqual( s.cdddr(crlist),
               null,
               "cdddr" );
  });
  
  
  test("list_ref", function () {
    deepEqual( s.list_ref(s.list(1, 2, 3), 0),
               1,
               "get first element" );
    
    deepEqual( s.list_ref(s.list(1, 2, 3), 2),
               3,
               "get last element" );
  });
  
  
  test("second...tenth", function () {
    var l = s.list(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);
    
    deepEqual( s.second(l),
               2,
               "second" );
    deepEqual( s.third(l),
               3,
               "third" );
    deepEqual( s.fourth(l),
               4,
               "fourth" );
    deepEqual( s.fifth(l),
               5,
               "fifth" );
    deepEqual( s.sixth(l),
               6,
               "sixth" );
    deepEqual( s.seventh(l),
               7,
               "seventh" );
    deepEqual( s.eighth(l),
               8,
               "eighth" );
    deepEqual( s.ninth(l),
               9,
               "ninth" );
    deepEqual( s.tenth(l),
               10,
               "tenth" );
  });
  
  
  test("car_cdr", function () {
    deepEqual( s.car_cdr(s.list(1, 2, 3)),
               [1, s.list(2, 3)],
               "car_cdr" );
    });
    
    
  test("take", function () {
    deepEqual( s.take(s.list(1, 2, 3, 4), 2),
               s.list(1, 2),
               "take first 2 elements" );
    
    deepEqual( s.take(s.list(1, 2, 3, 4), 0),
               null,
               "take with n = 0" );
    
    deepEqual( s.take(s.list(1, 2, 3, 4), 4),
               s.list(1, 2, 3, 4),
               "take with n = list length" );
  });
  
  
  test("drop", function () {
    deepEqual( s.drop(s.list(1, 2, 3, 4), 2),
               s.list(3, 4),
               "drop last all but last 2 elements" );
    
    deepEqual( s.drop(s.list(1, 2, 3, 4), 0),
               s.list(1, 2, 3, 4),
               "drop with n = 0" );
    
    deepEqual( s.drop(s.list(1, 2, 3, 4), 4),
               null,
               "drop with n = list length" );
  });
  
  
  test("take_right", function () {
    deepEqual( s.take_right(s.list(1, 2, 3, 4), 2),
               s.list(3, 4),
               "take right" );
  });
  
  
  test("drop_right", function () {
    deepEqual( s.drop_right(s.list(1, 2, 3, 4), 2),
               s.list(1, 2),
               "drop right" );
  });
  
  
  test("split_at", function () {
    deepEqual( s.split_at(s.list(1, 2, 3, 4), 2),
               s.cons(s.list(1, 2), s.list(3, 4)),
               "split at 2" );
  });
  
  
  test("last", function () {
    deepEqual( s.last(s.list(1, 2, 3)),
               3,
               "last element" );
  });
  
  
  test("last_pair", function () {
    deepEqual( s.last_pair(s.list(1, 2, 3)),
               s.cons(3, null),
               "last pair" );
  });
  
  
  test("length", function () {
    deepEqual( s.length(s.list(0, 1, 2)),
               3,
               "length of a proper list" );
    
    deepEqual( s.length(null),
               0,
               "length of the empty list" );
    
    deepEqual( s.length(s.cons(1, 2)),
               1,
               "length of a pair" );
    
    deepEqual( s.length(s.cons(1, s.cons(2, 3))),
               2,
               "length of an improper list" );
  });
  
  
  test("length_plus", function () {
    deepEqual( s.length_plus(null),
               0,
               "the empty list" );
    
    deepEqual( s.length_plus(s.list(1, 2, 3)),
               3,
               "list of length 3" );
    
    deepEqual( s.length_plus(s.cons(1, 2)),
               1,
               "length of a pair" );
    
    deepEqual( s.length_plus(s.cons(1, s.cons(2, 3))),
               2,
               "length of an improper list" );
    
    deepEqual( s.length_plus(s.circular_list(1)),
               false,
               "length of a circular list" );
  });
  
  
  test("length_circular", function () {
    deepEqual( s.length_circular(null),
               0,
               "the empty list" );
    
    deepEqual( s.length_circular(s.list(1, 2, 3)),
               3,
               "list of length 3" );
    
    deepEqual( s.length_circular(s.cons(1, 2)),
               1,
               "length of a pair" );
    
    deepEqual( s.length_circular(s.cons(1, s.cons(2, 3))),
               2,
               "length of an improper list" );
    
    deepEqual( s.length_circular(s.circular_list(1)),
               1,
               "length of a circular list" );
    
    deepEqual( s.length_circular(s.circular_list(1, 2, 3)),
               3,
               "length of a circular list" );
  });
  
  
  test("append", function () {
    deepEqual( s.append(s.list(1, 2), s.list(3, 4)),
               s.list(1, 2, 3, 4),
               "append 2 lists" );
    
    deepEqual( s.append(s.list(1, 2), s.list(3, 4), s.list(5, 6)),
               s.list(1, 2, 3, 4, 5, 6),
               "append 3 lists" );
    
    deepEqual( s.append(s.list(1), s.list(2), 3),
               s.cons(1, s.cons(2, 3)),
               "append 2 lists and an atom (should return an improper list)" );
  });
  
  
  test("append_d", function () {
    var a = s.list(1, 2),
        b = s.list(3, 4),
        c = s.list(5, 6),
        d = s.append_d(a, b, c);
    
    deepEqual( d,
               s.list(1, 2, 3, 4, 5, 6),
               "append_d" );
  });
  
  
  test("concatenate", function () {
    deepEqual( s.concatenate(s.list(s.list(1, 2), s.list(3, 4))),
               s.list(1, 2, 3, 4),
               "concatenate 2 lists" );
    
    deepEqual( s.concatenate(s.list(s.list(1, 2), s.list(3, 4), s.list(5, 6))),
               s.list(1, 2, 3, 4, 5, 6),
               "concatenate 3 lists" );
    
    deepEqual( s.concatenate(s.list(s.list(1, 2), null, s.list(3, 4))),
               s.list(1, 2, 3, 4),
               "concatenate with an empty list" );
  });
  
  
  test("concatenate_d", function () {
    var a = s.list(1, 2),
        b = s.list(3, 4),
        c = s.list(5, 6),
        d = s.list(a, b, c),
        e = s.concatenate_d(d);
    
    deepEqual( e,
               s.list(1, 2, 3, 4, 5, 6),
               "concatenate_d" );
  });
  
  
  test("reverse", function () {
    deepEqual( s.reverse(s.list(1, 2, 3)),
               s.list(3, 2, 1),
               "reverse" );
  });
  
  
  test("reverse_d", function () {
    deepEqual( s.reverse_d(s.list(1, 2, 3)),
               s.list(3, 2, 1),
               "reverse_d" );
  });
  
  
  test("append_reverse", function () {
    deepEqual( s.append_reverse(s.list(1, 2, 3), s.list(4, 5, 6)),
               s.list(3, 2, 1, 4, 5, 6),
               "append_reverse" );
  });
  
  
  test("append_reverse_d", function () {
    deepEqual( s.append_reverse_d(s.list(1, 2, 3), s.list(4, 5, 6)),
               s.list(3, 2, 1, 4, 5, 6),
               "append_reverse_d" );
  });
  
  
  test("zip", function () {
    deepEqual( s.zip(s.list(1, 2), s.list(3, 4)),
               s.list(s.list(1, 3), s.list(2, 4)),
               "zip 2 equal length lists" );
    
    deepEqual( s.zip(s.list(1, 2, 5), s.list(3, 4)),
               s.list(s.list(1, 3), s.list(2, 4)),
               "zip 2 unequal length lists" );

    deepEqual( s.zip(s.list(1, 2), s.list(3, 4, 5)),
               s.list(s.list(1, 3), s.list(2, 4)),
               "zip 2 unequal length lists" );
  });
  
  
  test("unzip1", function () {
    deepEqual( s.unzip1(s.list(1, 2), s.list(3, 4)),
               s.list(1, 3),
               "unzip1" );
  });
  
  
  test("unzip2", function () {
    deepEqual( s.unzip2(s.list(1, 2), s.list(3, 4)),
               s.list(s.list(1, 3), s.list(2, 4)),
               "unzip2" );
  });
  
  
  test("unzip3", function () {
    deepEqual( s.unzip3(s.list(1, 2, 3), s.list(4, 5, 6)),
               s.list(s.list(1, 4), s.list(2, 5), s.list(3, 6)),
               "unzip3" );
  });
  
  
  test("unzip4", function () {
    deepEqual( s.unzip4(s.list(1, 2, 3, 4), s.list(5, 6, 7, 8)),
               s.list(s.list(1, 5), s.list(2, 6), s.list(3, 7), s.list(4, 8)),
               "unzip4" );
  });
  
  
  test("unzip5", function () {
    deepEqual( s.unzip5(s.list(1, 2, 3, 4, 5), s.list(6, 7, 8, 9, 10)),
               s.list(s.list(1, 6), s.list(2, 7), s.list(3, 8), s.list(4, 9), s.list(5, 10)),
               "unzip5" );
  });
  
  
  test("count", function () {
    deepEqual( s.count(function (x) { return x < 3; }, s.list(1, 2, 3, 4)),
               2,
               "1 argument" );
    
    deepEqual( s.count(function (x, y) { return x < y; }, s.list(1, 3, 7), s.list(2, 4, 6)),
               2,
               "2 arguments" );
  });
  
  
  test("map", function () {
    deepEqual( s.map(function (x) { return x+1; }, s.list(1, 2, 3)),
               s.list(2, 3, 4),
               "add 1 to each element of list" );
    
    deepEqual( s.map(function (x, y) { return x+y; },
                     s.list(1, 2, 3),
                     s.list(3, 4, 5)),
               s.list(4, 6, 8),
               "map with 2 lists" );
    
    deepEqual( s.map(function (x, y) { return x+y; },
                     s.list(1, 2, 3, 4),
                     s.list(3, 4, 5)),
               s.list(4, 6, 8),
               "map with unequal length lists" );
    
    deepEqual( s.map(function (x, y) { return x+y; },
                     s.list(1, 2, 3),
                     s.list(3, 4, 5, 6)),
               s.list(4, 6, 8),
               "map with unequal length lists" );
    
    deepEqual( s.map(function (x, y, z) { return x+y+z; },
                     s.list(1, 2, 3, 10),
                     s.list(3, 4, 5),
                     s.list(3, 2, 1, 20, 30)),
               s.list(7, 8, 9),
               "map with 3 lists" );
  });
  
  
  test("fold", function () {
    deepEqual( s.fold(function (a, b) { return a + b; },
                      0,
                      s.list(1, 2, 3)),
               6,
               "add" );
    
    deepEqual( s.fold(function (a, b) { return s.cons(a, b); },
                      null,
                      s.list(1, 2, 3)),
               s.list(3, 2, 1),
               "cons (reverse list)" );
    
    deepEqual( s.fold(function (a, b, c) { return s.cons(a+b, c); },
                      null,
                      s.list(1, 2, 3),
                      s.list(4, 5, 6)),
               s.list(9, 7, 5),
               "add and cons" );
  });
  
  
  test("pair_fold", function () {
    deepEqual( s.pair_fold(function (a, b) { return s.car(a) + b; },
                           0,
                           s.list(1, 2, 3)),
               6,
               "add" );
    
    deepEqual( s.pair_fold(function (a, b) {
                             if (a.cdr !== null) { return a.car + a.cdr.car + b; }
                             else { return a.car + b; } },
                           0,
                           s.list(1, 2, 3)),
               11,
               "add car to cadr" );
  });
  
  
  test("unfold", function () {
    deepEqual( s.unfold(function (n) { return n === 3; },
                        function (n) { return 0 + n * 1; },
                        function (n) { return n + 1; },
                        0),
               s.list(0, 1, 2),
               "create (0 1 2) (iota start stop step) where start=0 stop=3 step=1" );
  });
  
  
  test("unfold_right", function () {
    deepEqual( s.unfold_right(function (n) { return n === 0; },
                              function (n) { return 0 + ((n - 1) * 1); },
                              function (n) { return n - 1; },
                              3),
               s.list(0, 1, 2),
               "create (0 1 2) (iota start stop step) where start=0 stop=3 step=1" );
  });
  
  
  test("for_each", function () {
    var a = [],
        list = s.list(1, 2, 3);
    
    s.for_each(function (x) { a.push(x); }, list);
    
    deepEqual( a,
               [1, 2, 3],
               "push each element from list to a" );
  });
  
  
  test("map_in_order", function () {
    var a = [],
        list = s.list(1, 2, 3),
        r;
    
    r = s.map_in_order(function (x) { a.push(x); return x+1; }, list);
    
    deepEqual( a,
               [1, 2, 3],
               "push each element from list to a" );
    
    deepEqual( r,
               s.list(2, 3, 4),
               "return value from map_in_order" );
  });
  
  
  test("filter_map", function () {
    deepEqual( s.filter_map(function (x) { return x < 5 && x + 1; }, s.list(1, 3, 5, 7)),
               s.list(2, 4),
               "filter_map" );
  });
  
  
  test("reduce", function () {
    deepEqual( s.reduce(function (x, y) { return x+y; }, 0, s.list(1, 2, 3)),
               6,
               "add all numbers in a list" );
    
    deepEqual( s.reduce(function (x, y) { return Math.max(x, y); }, 0, s.list(1, 2, 3, 2, 1)),
               3,
               "find the max value in a list" );
    
    deepEqual( s.reduce(function (x, y) { return x+y; }, "", s.list("a", "b", "c")),
               "cba",
               "string" );
  });
  
  
  test("reduce_right", function () {
    deepEqual( s.reduce_right(function (x, y) { return x+y; }, "", s.list("a", "b", "c")),
               "abc",
               "reduce_right" );
  });
  
  
  test("filter", function () {
    deepEqual( s.filter(function (x) { return x < 3; }, s.list(1, 2, 3, 4)),
               s.list(1, 2),
               "return list of values less than 3" );
  });
  
  
  test("filter_d", function () {
    deepEqual( s.filter_d(function (x) { return x < 3; }, s.list(1, 2, 3, 4, 1)),
               s.list(1, 2, 1),
               "return list of values less than 3" );
    
    deepEqual( s.filter_d(function (x) { return x > 2; }, s.list(1, 2, 3, 4, 1)),
               s.list(3, 4),
               "return list of values less than 3" );
  });
  
  
  test("partition", function () {
    deepEqual( s.partition(function (x) { return (x % 2) === 0; }, s.list(1, 2, 3, 4)),
               s.cons(s.list(2, 4), s.list(1, 3)),
               "partition on even?" );
  });
  
  
  test("partition_d", function () {
    deepEqual( s.partition_d(function (x) { return (x % 2) === 0; }, s.list(1, 2, 3, 4)),
               s.cons(s.list(2, 4), s.list(1, 3)),
               "partition on even?" );
    
    deepEqual( s.partition_d(function (x) { return (x % 2) === 1; }, s.list(1, 2, 3, 4)),
               s.cons(s.list(1, 3), s.list(2, 4)),
               "partition on odd?" );
  });
  
  
  test("remove", function () {
    deepEqual( s.remove(function (x) { return x < 3; }, s.list(1, 2, 3, 4)),
               s.list(3, 4),
               "remove < 3" );
  });
  
  
  test("remove_d", function () {
    deepEqual( s.remove_d(function (x) { return x < 3; }, s.list(1, 2, 3, 4, 1)),
               s.list(3, 4),
               "remove < 3" );
    
    deepEqual( s.remove_d(function (x) { return x > 2; }, s.list(1, 2, 3, 4)),
               s.list(1, 2),
               "remove > 2" );
  });
  
  
  test("member", function () {
    deepEqual( s.member(2, s.list(1, 2, 3)),
               s.list(2, 3),
               "is 2 in (1 2 3)" );
    
    deepEqual( s.member(5, s.list(1, 2, 3)),
               false,
               "is 5 in (1 2 3)" );
    
    deepEqual( s.member(5, s.list(1, 2, 3), function (x, y) { return (x-3) === y; }),
               s.list(2, 3),
               "using optional equality procedure (subtract 2 from elem and compare)" );
    
    deepEqual( s.member(s.cons(3, 4), s.list(s.cons(1, 2), s.cons(3, 4), s.cons(5, 6))),
               s.list(s.cons(3, 4), s.cons(5, 6)),
               "pairs as elements" );
    
    deepEqual( s.member([3, 4], s.list([1, 2], [3, 4], [5, 6])),
               s.list([3, 4], [5, 6]),
               "arrays as elements" );
  });
  
  
  test("memv", function () {
    deepEqual( s.memv(2, s.list(1, 2, 3)),
               s.list(2, 3),
               "is 2 in (1 2 3)" );
    
    deepEqual( s.memv(5, s.list(1, 2, 3)),
               false,
               "is 5 in (1 2 3)" );
    
    deepEqual( s.memv(s.cons(3, 4), s.list(s.cons(1, 2), s.cons(3, 4), s.cons(5, 6))),
               false,
               "pairs as elements" );
    
    deepEqual( s.memv([3, 4], s.list([1, 2], [3, 4], [5, 6])),
               false,
               "arrays as elements" );
  });
  
  
  test("find", function () {
    deepEqual( s.find(function (x) { return x % 2 === 0; }, s.list(1, 2, 3)),
               2,
               "even number in (1 2 3)" );
    
    deepEqual( s.find(function (x) { return x % 2 === 0; }, s.list(1, 3, 5)),
               false,
               "even number in (1 3 5)" );
  });
  
  
  test("find_tail", function () {
    deepEqual( s.find_tail(function (x) { return x % 2 === 0; }, s.list(1, 2, 3)),
               s.list(2, 3),
               "even number in (1 2 3)" );
    
    deepEqual( s.find_tail(function (x) { return x % 2 === 0; }, s.list(1, 3, 5)),
               false,
               "even number in (1 3 5)" );
  });
  
  
  test("any", function () {
    deepEqual( s.any(function (x) { return x % 2 === 0; }, s.list(1, 2, 3)),
               true,
               "any even?" );
    
    deepEqual( s.any(function (x) { return x % 2 === 0; }, s.list(1, 3, 5)),
               false,
               "any even?" );
    
    deepEqual( s.any(function (x, y) { return x === y; },
                     s.list(1, 2, 3),
                     s.list(3, 2, 1)),
               true,
               "any with 2 lists" );
    
    deepEqual( s.any(function (x, y) { return x === y; },
                     s.list(1, 2, 3),
                     s.list(2, 3, 1)),
               false,
               "any with 2 lists" );
    
    deepEqual( s.any(function (x) { if (x % 2 === 0) { return x; } },
                     s.list(1, 2, 3, 4, 5)),
               2,
               "any return value" );
  });
  
  
  test("every", function () {
    deepEqual( s.every(function (x) { return x > 0; }, s.list(1, 2, 3)),
               true,
               "every > 0" );
    
    deepEqual( s.every(function (x) { return x > 0; }, s.list(1, -2, 3)),
               false,
               "every > 0" );
    
    deepEqual( s.every(function (x, y) { return x > 0 && y > 0; },
                       s.list(1, 2, 3),
                       s.list(4, 5, 6)),
               true,
               "every with 2 lists" );
    
    deepEqual( s.every(function (x, y) { return x > 0 && y > 0; },
                       s.list(1, 2, 3),
                       s.list(4, -5, 6)),
               false,
               "every with 2 lists" );

    deepEqual( s.every(function (x) { if (x > 0) { return x; } }, s.list(1, 2, 3)),
               3,
               "every return value" );
  });
  
  
  test("list_index", function () {
    deepEqual( s.list_index(function (x) { return x === 2; },
                            s.list(1, 2, 3)),
               1,
               "single list" );

    deepEqual( s.list_index(function (x) { return x === 6; },
                            s.list(1, 2, 3)),
               false,
               "not in list" );
    
    deepEqual( s.list_index(function (x, y) { return x === y; },
                            s.list(1, 2, 3),
                            s.list(3, 2, 1)),
               1,
               "2 lists" );
  });
  
  
  test("delete_elem", function () {
    deepEqual( s.delete_elem(2, s.list(1, 2, 3)),
               s.list(1, 3),
               "remove 2 from list" );
    
    deepEqual( s.delete_elem(1, s.list(1, 2, 3), function (a, b) { return a+1 === b; }),
               s.list(1, 3),
               "with custom equality function" );
  });
  
  
  test("assoc", function () {
    deepEqual( s.assoc(2, s.list(s.cons(1, 4), s.cons(2, 5), s.cons(3, 6))),
               s.cons(2, 5),
               "(2 . 5) in alist" );
    
    deepEqual( s.assoc(5, s.list(s.cons(1, 4), s.cons(2, 5), s.cons(3, 6))),
               false,
               "not found" );
    
    deepEqual( s.assoc(2, s.list(s.cons(1, 4), s.cons(2, 5), s.cons(3, 6)),
                       function (a, b) { return a+1 === b; }),
               s.cons(3, 6),
               "custom equality function" );
    
    deepEqual( s.assoc(s.cons(0, 2), s.list(s.cons(s.cons(0, 1), 0), s.cons(s.cons(0, 2), 1))),
               s.cons(s.cons(0, 2), 1),
               "pairs as keys" );
    
    deepEqual( s.assoc([3, 4], s.list(s.cons([1, 2], 0), s.cons([3, 4], 1), s.cons([5, 6], 2))),
               s.cons([3, 4], 1),
               "arrays as keys" );
  });
  
  
  test("assv", function () {
    deepEqual( s.assv(2, s.list(s.cons(1, 4), s.cons(2, 5), s.cons(3, 6))),
               s.cons(2, 5),
               "2 in alist" );
    
    deepEqual( s.assv(5, s.list(s.cons(1, 4), s.cons(2, 5), s.cons(3, 6))),
               false,
               "not found" );
    
    deepEqual( s.assv(s.cons(0, 2), s.list(s.cons(s.cons(0, 1), 0), s.cons(s.cons(0, 2), 1))),
               false,
               "pairs as keys (would return true with assoc)" );
    
    deepEqual( s.assv([3, 4], s.list(s.cons([1, 2], 0), s.cons([3, 4], 1), s.cons([5, 6], 2))),
               false,
               "arrays as keys" );
  });
  
  
  test("alist_cons", function () {
    deepEqual( s.alist_cons(3, 6, s.list(s.cons(1, 4), s.cons(2, 5))),
               s.list(s.cons(3, 6), s.cons(1, 4), s.cons(2, 5)),
               "alist_cons" );
  });
  
  
  test("alist_copy", function () {
    deepEqual( s.alist_copy(s.list(s.cons(1, 3), s.cons(2, 4))),
               s.list(s.cons(1, 3), s.cons(2, 4)),
               "alist_copy" );
  });
  
  
  test("lset_union", function () {
    deepEqual( s.lset_union(function (a, b) { return a === b; },
                            s.list(1, 2, 3),
                            s.list(2, 3, 4, 5)),
               s.list(5, 4, 1, 2, 3),
               "lset_union" );
  });
  
  
  test("to_array", function () {
    deepEqual( s.to_array(s.list(1, 2, 3)),
               [1, 2, 3],
               "to_array" );
  });
  
  
  test("to_string", function () {
    deepEqual( s.to_string(s.list(1, 2, 3)),
               "(1 2 3)",
               "Proper list" );
    
    deepEqual( s.to_string(s.cons(1, 2)),
               "(1 . 2)",
               "Pair" );
    
    deepEqual( s.to_string(s.cons(1, s.cons(2, 3))),
               "(1 2 . 3)",
               "improper list" );
  });
  
  
  test("array_to_list", function () {
    deepEqual( s.array_to_list([1, 2, 3]),
               s.list(1, 2, 3),
               "array_to_list" );
    
    deepEqual( s.array_to_list([]),
               null,
               "empty array" );
  });
  
  
});
