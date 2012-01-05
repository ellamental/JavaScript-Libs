$(document).ready(function () {
  var t = tree;
  
  module("tree.js");
  
  test("Node", function () {
    var n = new t.Node(42);
    
    equal( n.value,
           42,
           "create a node" );
  });
  
  
  
});
