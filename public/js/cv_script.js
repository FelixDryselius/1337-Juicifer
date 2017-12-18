var orderDrinksArray = [];

var startPage = new Vue({
    el: '#start',
    data: {
        seen: true
    }
})

var sizePage = new Vue({
    el: '#size',
    data: {
        seen: false
    }
})

var topbar = new Vue({
    el: '#topbar',
    data: {
        seen: false
    }
})

var smoothieIngredientsPage = new Vue({
  el: '#smoothieIngredients',
  data: {
    seen: false
  }
})

var juiceIngredientsPage = new Vue({
  el: '#juiceIngredients',
  data: {
    seen: false
  }
})

var ingredientsPage = new Vue({
  el: '#ingredPage',
  data: {
    seen: false
  }
})
      
var cartPage = new Vue({
  el: '#cart',
  data: {
    seen: false
  }
})

var drink = {
    type : "none", 
    size : "0", 
    ingredBase : "none",
    inCart : false,
};

function typeItem(type) {
    this.drink.type = type;
    orderDrinksArray.push(drink);
    console.log(drink.type + " new drink type");
    console.log(orderDrinksArray[0].type + " content array");
    startPage.seen = false;
    topbar.seen = false;
    sizePage.seen = true;
}

function sizeItem(size) {
    this.drink.size = size;
    console.log(drink.size + " new size");
    console.log(drink.type + " current drink type");
    console.log(orderDrinksArray[0].type + " " + orderDrinksArray[0].size + " content array");
    sizePage.seen = false;
    topbar.seen = true;
    if (drink.type === "smoothie"){
        smoothieIngredientsPage.seen = true;
    } else {
        juiceIngredientsPage.seen = true;
    }
}

function ingredBase() {
    closeAllIngred();
    var x = document.getElementById("ingredBase");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function ingredCat() {
    closeAllIngred();
    var x = document.getElementById("ingredCat");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function closeAllIngred() {
    var iB = document.getElementById("ingredBase");
    var iC = document.getElementById("ingredCat");
    iB.style.display = "none";
    iC.style.display = "none";
    }

function sendToCart() {
    this.drink.inCart = true;
    ingredientsPage.seen = false;
    cartPage.seen = true;
    console.log(orderDrinksArray[0].type + " " + orderDrinksArray[0].size + " " + orderDrinksArray[0].inCart + " content array");
}

console.log(drink.type + " innan");
console.log(drink.size + " innan");

