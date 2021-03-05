var rect = {
    perimeter: (x,y) => (2*(x+y)),
    area: (x,y) => (x*y)
};

function solveRect(l,b) {
    console.log('Solving for reactangle with l = ' + l + ' and b = ' + b);
    if( l<=0 || b<=0) { 
        console.log('Reactangle dimenstions should be greater than zero');
    }
    else {
        console.log('Area of Reactangle is ', rect.area(l,b) );
        console.log('Perimeter of Reactangle is ', rect.perimeter(l,b) );
    }
}

solveRect(5,6);
solveRect(3,-19);
solveRect(5,0);
