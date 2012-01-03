$(document).ready(function () {
  var m = misc;
  
  module("misc.js");
  
  test("recur", function () {
    var count = function (n) {
      var loop = function (c, n, sum) {
        if (c < n) {
          return function () {
            if (c > 49990) {
              return loop(c+1, n, sum+c+", ");
            }
            else {
              return loop(c+1, n, sum);
            }
          }
        }
        else {
          return sum;
        }
      };
      
      return m.recur(loop(0, n, ""));
    };

    equals( count(50000),
            "49991, 49992, 49993, 49994, 49995, 49996, 49997, 49998, 49999, ",
            "recursively count to 50000 (should blow recursion limit on most implementations)" );
  });
  
  
  
  
  
  
});