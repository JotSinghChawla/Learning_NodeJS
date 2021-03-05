var rect = require('./rectangle');

function solveRect(l,b) {
    console.log('Solving for reactangle with l = ' + l + ' and b = ' + b);
    
    rect(l,b,(err, rectangle) => { 
      if(err){
          console.log('Error: ',err.message);
      }
      else {
        console.log('Area of Reactangle is ', rectangle.area() );
        console.log('Perimeter of Reactangle is ', rectangle.perimeter() );
      }
    });
    console.log('This statement is after the "rect" call'); 
}

solveRect(5,6);
solveRect(3,-19);
solveRect(5,0);
