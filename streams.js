//___________________________________________________________________________//
// streams
//
// streams is an implementation of Scheme's SRFI-41 library
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



var streams = (function () {
  
  var s = {};
  
  s.Promise = function (fn) {
    this.is_ready = false;
    this.data = null;
    this.promise = fn;
  };
  
  s.Promise.prototype.toString = function () {
    return "[object Promise]";
  };
  
  s.is_promise = function (obj) {
    if (obj instanceof s.Promise) {
      return true;
    }
    else {
      return false;
    }
  };
  
  s.delay = function (expr) {
    if (expr instanceof Function) {
      return new s.Promise(expr);
    }
    else {
      throw "argument to delay must be a thunk (function with no arguments)";
    }
  };
  
  s.force = function (promise) {
    if (promise instanceof s.Promise) {
      if (promise.is_ready) {
        return promise.data;
      }
      else {
        promise.data = promise.promise();
        promise.is_ready = true;
        return promise.data;
      }
    }
    else {
      return promise;
    }
  };
  
  
  //________________________________________________________________________//
  // Streams
  //________________________________________________________________________//  
  
  s.Stream = function (car, cdr) {
    this.car = car;
    if (typeof cdr !== 'undefined') {
      this.cdr = s.delay(cdr);
    }
  };
  
  s.empty_stream = new s.Stream();
  
  s.Stream.prototype.is_empty = function () {
    if (typeof this.car === 'undefined' && typeof this.cdr === 'undefined') {
      return true;
    }
    return false;
  };
  
  s.is_stream = function (obj) {
    return s.force(obj) instanceof s.Stream;
  };
  
  s.is_empty = function (stream) {
    return stream.is_empty();
  };
  
  s.cons = function (car, cdr) {
    return new s.Stream(car, cdr);
  };
  
  s.car = function (stream) {
    return stream.car;
  };
  
  s.cdr = function (stream) {
    return s.force(stream.cdr);
  };
  
  s.make_stream = function () {
    if (arguments.length === 0) {
      return s.empty_stream;
    }
    rest = Array.prototype.slice.call(arguments, 1);
    return s.cons(arguments[0], function () { return s.make_stream.apply(null, rest); });
  };
  
  
  
  
  return s;
  
})();
