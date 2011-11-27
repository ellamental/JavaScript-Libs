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

// Seedable javascript implementation of a psudo-random number generator
// http://stackoverflow.com/questions/424292/how-to-create-my-own-javascript-random-number-generator-that-i-can-also-set-the


random = {
  // Set the random number generator so it can be swapped for a custom one
  random: Math.random,
  
  randint: function (start, stop) {
    if (typeof stop === 'undefined') {
      stop = start;
      start = 0;
    }
    return this.random() * (stop - start) + start;
  },
  
  range: function (start, stop, step) {
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
    return tmp;
  },
  
  choice: function (array) {
    return array[this.randint(array.length)];
  },
  
  randrange: function (start, stop, step) {
    return this.choice(this.range(start, stop, step));
  },
  
  shuffle: false,
  sample: false
};
