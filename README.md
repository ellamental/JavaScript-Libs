srfi1
======

srfi1 is a Javascript implementation of the SRFI-1 linked list library for Scheme.  This is a 'just for fun' implementation and probably shouldn't be used in production work.

[Documentation for SRFI-1 can be found here.]()

*** Naming ***

Javascript allows far fewer special characters in variable/property names, therefore the following conventions have been used:

* '-' characters in procedure names have been changed to '_'
* procedures which end in a '?' use the 'is_' prefix and do not have a '?'
* procedures which end in a '!' use the '_d' suffix to signal a potentially destructive operation, and do not have a '!'


*** Differences ***

length/length_plus
Both length and length_plus allow operations on improper lists, where they return the number of Pairs in the list.  For example the list (1 2 3) is length 3 while the list (1 2 . 3) is length 2.



*** Additions ***

to_array
Convert a list into a Javascript array.

to_string
Return a string representation of a list.

array_to_list
Convert an array into a list.
