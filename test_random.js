$(document).ready(function(){
  module("random.js");
  
  test("random", function () {
    random.seed(42);
    
    equal( random.random(),
           0.6848634963389486,
           "1st call" );
    
    equal( random.random(),
           0.5463244677521288,
           "2nd call" );
    
    // reset seed
    random.seed(42);
    
    equal( random.random(),
           0.6848634963389486,
           "3rd call" );
    
    equal( random.random(),
           0.5463244677521288,
           "4th call" );
  });
  
  
  test("randint", function () {
    random.seed(42);
    
    equal( random.randint(0, 10),
           6,
           "Random integer 0 <= i < 10" );
    
    equal( random.randint(0, 5),
           2,
           "Random integer 0 <= i < 5" );
  });
  
  
  test("choice", function () {
    random.seed(42);
    
    equal( random.choice([1, 2, 3, 4, 5]),
           4,
           "Random selection from [1, 2, 3, 4, 5]" );
  
    equal( random.choice([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
           6,
           "Random selection from [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" );
  });
  
  
  test("randrange", function () {
    random.seed(42);
    
    equal( random.randrange(0, 5),
           3,
           "Random selection from [0, 1, 2, 3, 4]" );
  
    equal( random.randrange(0, 10, 2),
           4,
           "Random selection from [0, 2, 4, 6, 8]" );
  });
  
  
});
