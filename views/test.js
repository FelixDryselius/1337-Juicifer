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

var drink = {
    type : "none", 
    size : "0", 
};


function typeItem(type) {
    this.drink.type = type;
    console.log(drink.type + " new drink type");
    startPage.seen = false;
    sizePage.seen = true;
}

function sizeItem(size) {
    drink.size = size;
    console.log(drink.size + " new size");
    console.log(drink.type + " current drink type");
}

console.log(drink.type + " innan");
console.log(drink.size + " innan");



