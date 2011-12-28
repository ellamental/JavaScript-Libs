//___________________________________________________________________________//
// random
//
// random is a library for psudo-random selection of numbers or elements in 
// a collection.
//
// random is free software: you can redistribute it and/or
// modify it under the terms of the GNU Affero General Public
// License version 3 as published by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License version 3 for more details.
//
// You should have received a copy of the GNU Affero General Public
// License version 3 along with this program. If not, see
// <http://www.gnu.org/licenses/>.
//___________________________________________________________________________//



var random = (function () {
  "use strict";

  //________________________________________________________________________//
  // PRNG Alea
  // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
  // http://baagoe.com/en/RandomMusings/javascript/
  //
  // There are a number of other PRNGs on that site which all share a common 
  // interface and can be swapped with this one.
  //________________________________________________________________________//
  
  function Mash() {
    var n = 0xefc8249d;

    var mash = function(data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    mash.version = 'Mash 0.9';
    return mash;
  }

  function Alea() {
    return (function(args) {
      var s0 = 0,
          s1 = 0,
          s2 = 0,
          c = 1;

      if (args.length === 0) {
        args = [+new Date()];
      }
      var mash = Mash();
      s0 = mash(' ');
      s1 = mash(' ');
      s2 = mash(' ');

      for (var i = 0; i < args.length; i++) {
        s0 -= mash(args[i]);
        if (s0 < 0) {
          s0 += 1;
        }
        s1 -= mash(args[i]);
        if (s1 < 0) {
          s1 += 1;
        }
        s2 -= mash(args[i]);
        if (s2 < 0) {
          s2 += 1;
        }
      }
      mash = null;

      var random = function() {
        var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
        s0 = s1;
        s1 = s2;
        return s2 = t - (c = t | 0);
      };
      random.uint32 = function() {
        return random() * 0x100000000; // 2^32
      };
      random.fract53 = function() {
        return random() + 
          (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
      };
      random.version = 'Alea 0.9';
      random.args = args;
      return random;

    } (Array.prototype.slice.call(arguments)));
  }
  
  
  //________________________________________________________________________//
  // random object
  //________________________________________________________________________//
  
  var r = {};
  
  // Set the PRNG so it can be swapped for a custom one
  r.PRNG = Alea;
  
  // Random float where 0 <= f < 1
  r.random = r.PRNG();
  
  r.seed = function (seed) {
    r.random = r.PRNG(seed);
  };
  
  r.randint = function (start, stop) {
    // Return a random integer between the range of start (inclusive) and
    // stop (exclusive).
    if (typeof stop === 'undefined') {
      stop = start;
      start = 0;
    }
    return Math.floor(r.random() * (stop - start) + start);
  };
  
  r.choice = function (array) {
    // Return a random element from array.
    return array[r.randint(array.length)];
  };
  
  r.randrange = function (start, stop, step) {
    // Return a random number in a range from start (inclusive) to
    // stop (exclusive).  step defaults to 1.
    var tmp = [];
    if (typeof step === 'undefined') {
      step = 1;
    }
    if (typeof stop === 'undefined') {
      stop = start;
      start = 0;
    }
    for (var i=start; i < stop; i += step) {
      tmp.push(i);
    }
    return r.choice(tmp);
  };
  
  //r.shuffle = false;
  //r.sample = false;
  
  return r;
})();
