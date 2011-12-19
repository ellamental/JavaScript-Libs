//___________________________________________________________________________//
// set.js
//
// set.js is a library for creating and working with sets.
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


var set = (function () {
  
  var s = {};
  
  
  //________________________________________________________________________//
  // Set type
  //________________________________________________________________________//
  
  s.Set = function () {
    var i, j;
    
    this.data = [];
    this.length = 0;
    
    for (i=0, j=arguments.length; i < j; i++) {
      if (this.data.indexOf(arguments[i]) < 0) {
        this.data.push(arguments[i]);
        this.length += 1;
      }
    }
        
    this.toString = function () {
      return "[object Set]";
    };
    
    this.toArray = function () {
      return this.data;
    };
  };
  
  s.set = function () {
    var newSet = Object.create(s.Set.prototype);
    s.Set.apply(newSet, arguments);
    return newSet;
  };
  
  
  //________________________________________________________________________//
  // Equality
  //________________________________________________________________________//
  
  s.isEqual = function (a, b) {
    if (!(a instanceof s.Set && b instanceof s.Set)) {
      return false;
    }
    else if (a.length !== b.length) {
      return false;
    }
    else {
      for (var i=0, j=a.length; i < j; i++) {
        if (b.data.indexOf(a.data[i]) < 0) {
          return false;
        }
      }
      return true;
    }
  };
  
  
  //________________________________________________________________________//
  // Return the set object
  //________________________________________________________________________//
  
  return s;
  
})();




//___________________________________________________________________________//
// Tests
//___________________________________________________________________________//


(function () {
  var s = set,
      counter, current_method;
    
  function t(expr, expected) {
    if (expected instanceof s.Set) {
      if (!s.isEqual(expr, expected)) {
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
  // Set
  //________________________________________________________________________//
  
  current_method = "Set"
  counter = 0;
  
  // 0 - empty Set
  t(new s.Set(),
    new s.Set());
  
  // 1 - one element Set
  t(new s.Set(1),
    new s.Set(1));
  
  // 2 - multiple element Set
  t(new s.Set(1, 2, 3),
    new s.Set(1, 2, 3));
  
  // 3 - unordered Sets still compare equal
  t(new s.Set(1, 2, 3),
    new s.Set(3, 2, 1));
  
  
  //________________________________________________________________________//
  // set
  //________________________________________________________________________//
  
  current_method = "set"
  counter = 0;
  
  // 0 - set
  t(s.set(1, 2, 3),
    s.set(3, 2, 1));
  
  
  //________________________________________________________________________//
  // isEqual
  //________________________________________________________________________//
  
  current_method = "isEqual"
  counter = 0;
  
  // 0 - empty Sets
  t(s.isEqual(s.set(), s.set()),
    true);
  
  // 1 - multiple elements
  t(s.isEqual(s.set(1, 2, 3), s.set(1, 2, 3)),
    true);
  
  // 2 - unordered Sets
  t(s.isEqual(s.set(1, 2, 3), s.set(3, 1, 2)),
    true);
  
  // 3 - unequal elements
  t(s.isEqual(s.set(1, 2, 3), s.set(2, 3, 4)),
    false);
  
  // 4 - unequal length
  t(s.isEqual(s.set(1, 2, 3), s.set(1, 2)),
    false);
  
  // 5 - Set and array
  t(s.isEqual(s.set(1, 2, 3), [1, 2, 3]),
    false);
  
  
  
  
  
  
  //________________________________________________________________________//
  // Finish tests and display # of functions implemented
  //________________________________________________________________________//
  
  console.log("Tests completed!");
  counter = 0;
  for(var i in set) {
    if (set.hasOwnProperty(i)) {
      counter += 1;
    }
  }
  return counter + " functions implemented";
})();
