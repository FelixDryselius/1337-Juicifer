'use strict';

var orderDrinksArray = [];

var all_cv = new Vue({
    el:'#all_cv',
    mixins: [sharedVueStuff],
    data: {
        showStartPage: true,
        showSizePage: false,
        showTopBar: false,
        showSmoothieIngredPage: false,
        showJuiceIngredPage: false,
        showIngredPage: false,
        showCartPage: false
    },
    
   
    methods: {
        hideAllTabs: function () {
            this.showStartPage = false;
            this.showSizePage = false;
            this.showTopBar = false;
            this.showSmoothieIngredPage = false;
            this.showJuiceIngredPage = false;
            this.showIngredPage = false;
            this.showCartPage = false;
        },
        showTab: function (tab) {
            console.log("test");
            this.hideAllTabs();
            if (tab === "smoothieIngredPage") {
                this.showSmoothieIngredPage = true;
            }
            else if (tab === "juiceIngredPage") {
                this.showJuiceIngredPage = true;
            }
            else if (tab === "orderHistory") {
                this.orderHistoryShow = true;
            }
            else if (tab === "inventory") {
                this.inventoryShow = true;
            }
            else if (tab === "statistics") {
                this.statisticsShow = true;
            }

        }
    }
});
    


/*var startPage = new Vue({
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
})*/

var drink = {
    type : "none", 
    size : "0", 
    baseIngred : "none",
    inCart : false,
};

function typeItem(type) {
    this.drink.type = type;
    orderDrinksArray.push(drink);
    console.log(drink.type + " new drink type");
    console.log(orderDrinksArray[0].type + " content array");
    all_cv.showStartPage = false;
    console.log(all_cv.showStartPage);
    all_cv.showTopbar = false;
    all_cv.showSizePage = true;
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

/*ordering.js
------------------------------*/

/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */


Vue.component('ingredient', {
  props: ['item', 'type', 'lang'],
  template: ' <div class="ingredient">\
                  <label>\
                    <button v-on:click="incrementCounter">{{ counter }}</button>\
                    {{item["ingredient_"+ lang]}} ({{ (type=="smoothie") ? item.vol_smoothie : item.vol_juice }} ml), {{item.selling_price}}:-, {{item.stock}} pcs\
                  </label>\
              </div>',
  data: function () {
    return {
      counter: 0
    };
  },
  methods: {
    incrementCounter: function () {
      this.counter += 1;
      this.$emit('increment');
    },
    resetCounter: function () {
      this.counter = 0;
    }
  }
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getOrderNumber() {
  // It's probably not a good idea to generate a random order number, client-side. 
  // A better idea would be to let the server decide.
  return "#" + getRandomInt(1, 1000000);
}

var vm = new Vue({
  el: '#all_cv',
  mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
  data: {
    type: '',
    chosenIngredients: [],
    volume: 0,
    price: 0
  },
  methods: {
    addToOrder: function (item, type) {
      this.chosenIngredients.push(item);
      this.type = type;
      if (type === "smoothie") {
        this.volume += +item.vol_smoothie;
      } else if (type === "juice") {
        this.volume += +item.vol_juice;
      }
      this.price += +item.selling_price;
    },
    placeOrder: function () {
      var i,
      //Wrap the order in an object
        order = {
          ingredients: this.chosenIngredients,
          volume: this.volume,
          type: this.type,
          price: this.price
        };
      // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)
      socket.emit('order', {orderId: getOrderNumber(), order: order});
      //set all counters to 0. Notice the use of $refs
      for (i = 0; i < this.$refs.ingredient.length; i += 1) {
        this.$refs.ingredient[i].resetCounter();
      }
      this.volume = 0;
      this.price = 0;
      this.type = '';
      this.chosenIngredients = [];
    }
  }
});
