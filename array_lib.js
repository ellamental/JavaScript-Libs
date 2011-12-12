//___________________________________________________________________________//
// array_lib
//
// array_lib is a collection of array functions
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


array_lib = {};

array_lib.is_equal = function (a, b, eq) {
  // General array equality, eq is an optional function that accepts 2
  // arguments and returns a boolean value (defaults to ===).
  eq = (typeof eq === 'undefined') ? function (x, y) { return x === y; } : eq;
  if (a instanceof Array && b instanceof Array) {
    if (a.length === b.length) {
      for (var i=0,j=a.length; i < j; i++) {
        if (!array_lib.is_equal(a[i], b[i], eq)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  else {
    return eq(a, b);
  }
};





//__________________________________________________________________________//
// Tests
//__________________________________________________________________________//

(function () {
  var a = array_lib,
      counter, current_method;
    
  function t(expr, expected) {
    if (!a.is_equal(expr, expected)) {
      console.log("Test Failed! "+current_method+": #"+counter);
    }
    counter++;
  }
  
  
  //________________________________________________________________________//
  // is_equal
  //________________________________________________________________________//
  
  current_method = "is_equal"
  counter = 0;
  
  // 0 - empty arrays
  t(a.is_equal([], []),
    true);
  
  // 2
  t(a.is_equal([1, 2, 3], [1, 2, 3]),
    true);
  
  // 3 - nested arrays
  t(a.is_equal([1, [2, 3]], [1, [2, 3]]),
    true);
  
  // 4 - eq function
  t(a.is_equal([1, 2, 3], [2, 3, 4], function (x, y) { return x === y-1; }),
    true);
  
  // not equal
  
  // 5 - different length
  t(a.is_equal([1, 2], [1, 2, 3]),
    false);
  
  // 6 - different elements
  t(a.is_equal([1, 2], [2, 1]),
    false);
  
  // 7 - nested arrays
  t(a.is_equal([1, [2, 3]], [1, [2, 4]]),
    false);
  
  // 8 - eq function
  t(a.is_equal([1, 2, 3], [1, 2, 3], function (x, y) { return x === y-1; }),
    false);
  
  
  
  
  
  
  
  
  
  
  //________________________________________________________________________//
  // Finish tests and display # of functions implemented
  //________________________________________________________________________//
  
  console.log("Tests completed!");
  counter = 0;
  for(var i in array_lib) {
    if (array_lib.hasOwnProperty(i)) {
      counter += 1;
    }
  }
  return counter + " functions implemented";
})();
