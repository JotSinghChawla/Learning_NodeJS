async function loadProduct() {
    // const response = (await fetch('/product.json')).json();

    const response = await fetch('/product.json')
        .then( res => {
            return res.json();                      // return is necessary in order to store in variable 
        })
        .catch( err => console.log('Error: ', err));

    return response.product;
}

document.addEventListener('DOMContentLoaded', async () => {
    var product = [];
    product = await loadProduct();                      // If it shows Promise{<pending>}           just add await in front
    console.log(product);
    for( let i=0; i<product.length; i+=4) {
        let newRow = document.createElement('div')
        newRow.className = 'row mt-5';
        let addRow = "";
        for( let j=0; j<4; j++) {
            if(  j + i >= product.length ) break;
            console.log('yes');
            addRow += `<div class="col-12 col-md-3"><div class="card" style="max-width: 18rem;"> <img class="card-img-top img-fluid rounded" style="min-height: 45vh; background-position: center" src=${product[j+i].image} > <div class="card-body"> <h5 class="card-title">${product[j+i].name}</h5> <p class="card-text">Price: ${product[j+i].price}</p> <a href="#" class="btn btn-primary">Add Item</a> <button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal${j+i}">Description</button> </div> </div></div> <div class="modal fade" id="modal${j+i}" > <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <h5 class="modal-title" id="exampleModalLabel">Description: ${product[j+i].name}</h5> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="modal-body"> ${product[j+i].description} </div> <div class="modal-footer"> <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button> </div> </div> </div> </div>`;
        }
        newRow.innerHTML = addRow;
        document.getElementById('main').appendChild(newRow);
    }   
});
