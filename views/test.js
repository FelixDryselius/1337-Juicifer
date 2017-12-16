var orderDrinksArray = [];

//Start of vue-views
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

var juiceIngredientsPage = new Vue({
  el: '#juiceIngredients',
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

var cartPage = new Vue({
  el: '#cart',
  data: {
    seen: false
  }
})

var orderDrinksArray = [];

var drink = {
    type : "none", 
    size : "0", 
    inCart : false,
};
//End of vue-views

function typeItem(type) {
    this.drink.type = type;
    orderDrinksArray.push(drink);
    console.log(drink.type + " new drink type");
    console.log(orderDrinksArray[0].type + " content array");
    startPage.seen = false;
    sizePage.seen = true;
}

function sizeItem(size) {
    this.drink.size = size;
    console.log(drink.size + " new size");
    console.log(drink.type + " current drink type");
    console.log(orderDrinksArray[0].type + " " + orderDrinksArray[0].size + " content array");
    sizePage.seen = false;
    ingredientsPage.seen = true;
}

function sendToCart() {
    this.drink.inCart = true;
    ingredientsPage.seen = false;
    cartPage.seen = true;
    console.log(orderDrinksArray[0].type + " " + orderDrinksArray[0].size + " " + orderDrinksArray[0].inCart + " content array");
}

console.log(drink.type + " innan");
console.log(drink.size + " innan");
