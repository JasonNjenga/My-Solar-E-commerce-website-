let iconCart = document.querySelector('.iconCart');
let cart = document.querySelector('.cart');
let container = document. querySelector('container');
let close = document.querySelector('.close');

iconCart.addEventListener('click', ()=>{
    if(cart.computedStyleMap.right == '-100%'){
        cart.style.right = '0';
        container.style.transform = 'translatex(-400px)';
    }else{
        cart.style.right = '-100%';
        container.style.transform = 'translatex(0)';   
    }
})
close.addEventListener('click',()=>{
    cart.style.right = '-100%';
    container.style.transform = 'translatex(0)';
}) 

let products = null;
//get data from file json
fetch('products.json')
.then(Response=> Response.json())
.then(data =>{
    products = data;
    addDataToHTML();
})

// show data in list html
function addDataToHTML(){
    // remove data default in html
    let listProductHTML = document.querySelector('.listproduct');
    listProductHTML.innerHTML = '';

    // add new datas
    if (products != null){
        products.foreach(product =>{
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.innerHTML =
            '<img src="${solar images}">';
            '<h2>${Product.Name}</h2>';
            '<div class="price">$${Product.Price}</div>';
            '<button onclick="addcart(${Product.ID})">Add To Cart</button>';
            listProductHTML.appendChild(newProduct);
        });
    }
}
let listCart =[];
function addcart($IDProduct){
    let productCopy = JSON.parse(JSON.stringify(products));
}