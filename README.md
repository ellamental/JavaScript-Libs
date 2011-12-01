srfi1
======

srfi1 is a Javascript implementation of the SRFI-1 linked list library for Scheme.  This is a 'just for fun' implementation and probably shouldn't be used in production work.

[The spec for SRFI-1 can be found here.](http://srfi.schemers.org/srfi-1/srfi-1.html)



### Naming ###

Javascript allows far fewer special characters in variable/property names, therefore the following conventions have been used:

* '-' characters in procedure names have been changed to '_'
* procedures which end in a '?' use the 'is_' prefix and do not have a '?'
* procedures which end in a '!' use the '_d' suffix to signal a potentially destructive operation, and do not have a '!'
* Misc: length+ has been renamed to length_plus and cons* has been renamed to cons_list



### Differences ###

**length/length_plus**

Both length and length_plus allow operations on improper lists, where they return the number of Pairs in the list.  For example the list (1 2 3) is length 3 while the list (1 2 . 3) is length 2.



### Additions ###

**length_circular**

Calculate the number of elements in a circular list.

**to_array**

Convert a list into a Javascript array.

**to_string**

Return a string representation of a list.

**array_to_list**

Convert an array into a list.



### Tests ###

A test suite is included in the library.  Currently it is part of the main srfi1.js file and is run upon loading the library.