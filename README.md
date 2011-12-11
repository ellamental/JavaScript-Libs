srfi1
======

srfi1 is a Javascript implementation of the SRFI-1 linked list library for Scheme.  This is a 'just for fun' implementation and probably shouldn't be used in production work.

This implementation is about 80% complete and has been tested in Firefox 8 and Chromium 15.  There are no dependencies for this project.

[The spec for SRFI-1 can be found here.](http://srfi.schemers.org/srfi-1/srfi-1.html)



## Naming ##

Javascript allows far fewer special characters in variable/property names, therefore the following conventions have been used:

* '-' characters in procedure names have been changed to '\_'
* procedures which end in a '?' use the 'is\_' prefix and do not have a '?'
* procedures which end in a '!' use the '\_d' suffix to signal a potentially destructive operation, and do not have a '!'
* Misc:
  * length+ has been renamed to length\_plus
  * cons* has been renamed to cons\_list
  * delete has been renamed to delete\_elem



## Differences ##

**length/length\_plus**  
Both length and length\_plus allow operations on improper lists, where they return the number of Pairs in the list.  For example the list (1 2 3) is length 3 while the list (1 2 . 3) is length 2.



## Additions ##

**length\_circular**  
Calculate the number of elements in a circular list.

**to\_array**  
Convert a list into a Javascript array.

**to\_string**  
Return a string representation of a list.

**array\_to\_list**  
Convert an array into a list.



## Tests ##

A test suite is included in the library.  Currently it is part of the main srfi1.js file and is run upon loading the library.