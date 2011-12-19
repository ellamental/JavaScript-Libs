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


var Set = function () {
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

  this.equals = function (other) {
    var i, j;
    if (!(other instanceof Set)) {
      return false;
    }
    else if (other.length !== this.length) {
      return false;
    }
    else {
      for (i=0, j=this.length; i < j; i++) {
        if (other.data.indexOf(this.data[i]) < 0) {
          return false;
        }
      }
      return true;
    }
  };
  
  this.isEmpty = function () {
    return this.length === 0;
  };
  
  
  this.add = function (element) {
    if (this.data.indexOf(element) < 0) {
      this.data.push(element);
      this.length += 1;
    }
  };
  
  this.remove = function (element) {
    var idx = this.data.indexOf(element);
    if (idx >= 0) {
      this.data.splice(idx, 1);
      this.length -= 1;
    }
  };
  
  
  
};
