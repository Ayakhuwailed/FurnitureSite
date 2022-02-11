const productList=document.querySelector(".product-list")
const cartContainer=document.querySelector(".cart-container")
const cartList=document.querySelector(".cart-list")
const cartTotalValue=document.getElementById("cart-total-value")
const cartCountInfo=document.getElementById("cart-count-info")
let cartItemID=1
eventListener()

function eventListener(){
    window.addEventListener('DOMContentLoaded',()=>{
      
        loadJson()
        loadCart()
    })
    document.querySelector(".navbar-toggler").addEventListener("click",()=>{
        document.querySelector(".navbar-collapse").classList.toggle("show-navbar")
    })
document.getElementById("cart-btn").addEventListener("click",()=>{
    cartContainer.classList.toggle("show-cart-container")


})
productList.addEventListener("click",purchaseProduct)
cartList.addEventListener("click",deleteProduct)

}
function updateCartInfo(){
  let cartInfo=findCartInfo()
cartCountInfo.textContent=cartInfo.productCount;
cartTotalValue.textContent=cartInfo.total;
}
// updateCartInfo()

function loadJson(){
    fetch('furniture.json')
    .then(res=>res.json())
    .then(data=>{
        let html='';
        data.forEach(product=>{
            // console.log(product);
            html+=
            `
            <div class = "product-item" >
              <div class = "product-img">
                <img src = "${product.imgSrc}" alt = "product image">
                <button type = "button" class = "add-to-cart-btn">
                  <i class = "fas fa-shopping-cart"></i>Add To Cart
                </button>
              </div>
              <div class = "product-content">
                <h3 class = "product-name">${product.name}</h3>
                <span class = "product-category">${product.category}</span>
                <p class = "product-price">${product.price}</p>
              </div>
            </div>
            `;
        })
        productList.innerHTML=html
    }).catch(error=>{
        alert("user live server or local server")
    })
}


function purchaseProduct(e){
    if(e.target.classList.contains('add-to-cart-btn')){
        let product=e.target.parentElement.parentElement
        getProductInfo(product)
  
    }
}


function getProductInfo(product){
    let productInfo={
        id:cartItemID,
        imgSrc:product.querySelector('.product-img img').src,
        name:product.querySelector('.product-name').textContent,
category:product.querySelector('.product-category').textContent,
price:product.querySelector('.product-price').textContent
    }
    cartItemID++;
    addToCart(productInfo)
    saveProductInStorage(productInfo)
   
  }

function addToCart(product){
const cartitem=document.createElement('div')
    cartitem.classList.add('cart-item')
cartitem.setAttribute('data-id',`${product.id}`)
cartitem.innerHTML+=`
                    <img src = "${product.imgSrc}" alt = "product image">
                    <div class = "cart-item-info">
                      <h3 class = "cart-item-name">${product.name}</h3>
                      <span class = "cart-item-category">${product.category}</span>
                      <span class = "cart-item-price">${product.price}</span>
                    </div>
                    <button type = "button" class = "cart-item-del-btn">
                      <i class = "fas fa-times"></i>
                    </button>
                


`;

  cartList.appendChild(cartitem)
}

function saveProductInStorage(item){
  let products=getProductFromStorage()
products.push(item)
localStorage.setItem('products',JSON.stringify(products))
updateCartInfo()
}

function getProductFromStorage(){
  return localStorage.getItem('products') ? JSON.parse
  (localStorage.getItem('products')):[];
}

function loadCart(){
  let products=getProductFromStorage()
  if(products.length<1){
    cartItemID=1;
  }
else{
  cartItemID=products[products.length-1].id
  cartItemID++
}
products.forEach(product=>{
  addToCart(product)
})
updateCartInfo()
}

function findCartInfo(){
  let products=getProductFromStorage()
  let total=products.reduce((acc,product)=>{
    let price=parseFloat(product.price)
  return acc+=price;
  console.log(total);
  },0)
return{
  total:total.toFixed(2),
  productCount:products.length
}
}

function deleteProduct(e){
let cartitem
if(e.target.tagName==="BUTTON"){
  cartitem=e.target.parentElement
  cartitem.remove(); //here
}
else if(e.target.tagName=="I"){
cartitem=e.target.parentElement.parentElement
cartitem.remove();

}
let products=getProductFromStorage()
let updateProducts=products.filter(product=>{
  return product.id!==parseInt(cartitem.dataset.id)
})
localStorage.setItem('products',JSON.stringify(updateProducts)) //what????/
updateCartInfo()
}
