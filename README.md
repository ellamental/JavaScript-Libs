array_lib
======

A JavaScript Array library.  Inspired by Python and Scheme's SRFI-1.

[Python's list methods can be found here.]()
[The spec for SRFI-1 can be found here.](http://srfi.schemers.org/srfi-1/srfi-1.html)



## Naming ##

Most functions are non-destructive, that is, they don't modify the original array.  Functions which do modify the original array end with a $ symbol.


## Tests ##

A test suite is included. Currently it is part of the main array_lib.js file and is run upon loading the library.


## Documentation ##

\* GitHub does not yet support internal reference links in README files, so the TOC is non-working.


### Equality and comparison ###

* [is_equal](#is_equal) <a id="i_is_equal"/>


### map, fold, reduce, etc ###

* [map](#map)  [map$](#map$) <a id="i_map"/>


### Filtering and partitioning ###

* [filter](#filter) [filter$](#filter$) <a id="i_filter"/>
* [remove](#remove) [remove$](#remove$) <a id="i_remove"/>
* [partition](#partition) [partition$](#partition$) <a id="i_partition"/>


### Searching ###

* [index](#index) <a id="i_index"/>
* [indexOf](#indexOf) <a id="i_indexOf"/>
* [find](#find) <a id="i_find"/>
* [any](#any) <a id="i_any"/>


-------------------------------------------------------------------------------

### Equality and comparison ###

[**is_equal**](#i_is_equal) (a, b) <a id="is_equal"/>

General array equality, eq is an optional function that accepts 2 arguments and returns a boolean value (defaults to ===).

    is_equal(42, 42) //===> true
    is_equal([1, 2, 3], [1, 2, 3]) //===> true
    is_equal([1, [2, 3]], [1, [2, 3]]) //===> true

<br /><br />

### map, fold, reduce, etc ###

[**map**](#i_map) <a id="map"/>  
[**map$**](#i_map) (fn, array, ...) <a id="map$"/>

Returns a new array that is the result of applying fn to each element of array.  fn is a function taking as many arguments as there are array arguments and returning a single value.

    map(function (x) { return x+1; }, [0, 1, 2]) //===> [1, 2, 3]
    map(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5]) //===> [3, 5, 7]
    map(function (x, y) { return x+y; }, [0, 1, 2, 10], [3, 4, 5]) //===> [3, 5, 7]
    map(function (x, y) { return x+y; }, [0, 1, 2], [3, 4, 5, 10]) //===> [3, 5, 7]

\* map$ is allowed, but not required, to destructively update the first array argument to produce its result.

<br /><br />

### Filtering and partitioning ###

[**filter**](#i_filter) <a id="filter"/>  
[**filter$**](#i_filter) (pred, array) <a id="filter$"/>

Return a new array consisting of all the elements for which pred(element) returns true.

    filter(function (x) { return x < 3; }, [1, 2, 3, 4]) //===> [1, 2]

\* filter$ is allowed, but not required, to destructively update the array argument to produce its result.

<br />

[**remove**](#i_remove)  
[**remove$**](#i_remove) (pred, array, *count*) <a id="remove$"/>

Remove count elements for which pred(element) returns true and return a newly allocated array.  If count is not provided all elements for which pred(element) returns true will be removed.

    remove(function (x) { return x === 2; }, [1, 2, 3, 4]) //===> [1, 3, 4]
    remove(function (x) { return x < 3; }, [1, 3, 2, 4]) //===> [3, 4]
    remove(function (x) { return x < 5; }, [1, 2, 3, 4, 5, 6, 7], 2) //===> [3, 4, 5, 6, 7]

\* remove$ is allowed, but not required, to destructively update the array argument to produce its result.

<br />

[**partition**](#i_partition)  
[**partition$**](#i_partition) (pred, array) <a id="partition$"/>

Returns an array consisting of two arrays, one containing elements for which pred(element) returns true (return[0]) and one with elements for which pred(element) returns false (return[1]).

    partition(function (x) { return x < 3; }, [1, 3, 2, 4]) //===> [[1, 2], [3, 4]]

\* partition$ is allowed, but not required, to destructively update the array argument to produce its result.

<br /><br />

### Searching ###

[**index**](#i_index) (pred, array, ...) <a id="index"/>

Return the index of the left-most element for which pred(array_0[i], ..., array_n[i]) returns true or -1 if no index matches.

    index(function (x) { return x === 2; }, [1, 2, 3]) //===> 1
    index(function (x) { return x === 42; }, [1, 2, 3]) //===> -1
    index(function (x, y) { return x > y; }, [1, 2, 3], [3, 2, 1]) //===> 2

<br />

[**indexOf**](#i_indexOf) (element, array, *start*) <a id="indexOf"/>

Return the index of the left-most element in array that === element or -1 if no index matches.  The optional start argument can be used to exclude the first n indices of the array.

    indexOf(2, [1, 2, 3]) //===> 1
    indexOf(42, [1, 2, 3]) //===> -1
    indexOf(42, [0, 42, 7, 35, 42, 64], 2) //===> 4
    indexOf(42, [42, 35, 7, 0], 1) //===> -1

<br />

[**find**](#i_find) (pred, array) <a id="find"/>

Return the first element of array which satisifes pred, false if no element does.

    find(function (x) { return x % 2 === 0; }, [1, 3, 4, 5]) //===> 4
    find(function (x) { return x % 2 === 0; }, [1, 3, 5]) //===> false

<br />

[**any**](#i_any) (pred, array, ...) <a id="any"/>

Return true if pred(element) returns true for all elements of array.

    any(function (x) { return x % 2 === 0; }, [1, 3, 4])
    any(function (x) { return x % 2 === 0; }, [1, 3, 5])
    any(function (x, y) { return x > y; }, [1, 2, 3], [3, 2, 1])

