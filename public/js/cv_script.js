'use strict';

var orderDrinksArray = [];

/*


/*ordering.js
------------------------------*/

/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket 




var drink = {
    type : "none", 
    size : "0", 
    ingredBase : "none",
    inCart : false,
};

*/

//Funktion som genererar ett slumpmässigt tal
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


//Funktion som kallar på ett slumpmässigt tal mellan 1 till 1,000,000
function getOrderNumber() {
    // It's probably not a good idea to generate a random order number, client-side. 
    // A better idea would be to let the server decide.
    return "#" + getRandomInt(1, 1000000);
}


// Start vue-komponent:
//
Vue.component('ingredient', {
    props: ['item', 'lang'],
    template: ' <button class="ingredient" v-on:click="addIngredientToDrink"> {{item["ingredient_"+ lang]}} </button>',
    methods: {
        addIngredientToDrink: function () {
            this.$emit('add-ingredient');
        },
    }
});


// Start vue-objekt:
var drink = new Vue({
    el: '#all_cv', //Hela html-dokumentet hämtas
    mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
    data: {
        type: '', // Orderns typ {juice, smoothie}
        chosenIngredients: [], // Ingredienser i ordern {alla ingredienser i databasen}
        volume: 0, // Storlek på drycken
        price: 0,

        // Olika delar av html-dokumentet. Startsidan börjar med att visas (true) och resten är osynliga (false)
        showStartPage: true,
        showHelp: true,
        showSizePage: false,
        showTopBar: false,
        showSmoothieIngredPage: false,
        showJuiceIngredPage: false,
        showButtonBox: false,
        showCatButtons: false,
        showIngredientsButtons: false,
        showCartPage: false,
        chosenCatName: '',
        searchTerm: ''

    },
    
    // Metoder i vue-objektet:
    methods: {
        // Funktion som osynliggör allt
        hideAllTabs: function () {
            this.showStartPage = false;
            this.showHelp = true;
            this.showSizePage = false;
            this.showTopBar = false;
            this.showSmoothieIngredPage = false;
            this.showJuiceIngredPage = false;
            this.showIngredientsButtons = false;
            this.showCartPage = false;
        },
        

    //The function that is activated when "cart" is pressed    
    goToCart: function() {
    this.hideAllTabs();
    this.showTopBar = true;
    this.showCartPage =true;
    },
        
        filtered_ingredients: function(cat) {
            return this.ingredients.filter(function(item) {
                if(cat ===''){
                    return item }
                else {
                    return item["ingredient_cat"] === cat;
                }
            })
        },

        searched_ingredients: function(ingred){
            if(this.searchTerm === ''){
                return ingred }
            else if( ingred['ingredient_'+ this.lang].indexOf(this.searchTerm) !==-1){
                return ingred;

            }
        }, 

        showAllIngredients: function(){
            this.chosenCatName='';
        },



        doShowIngredientsButtons: function(catName){
            this.chosenCatName = catName;
            this.showCatButtons = false;
            this.showIngredientsButtons = true;
        },

        choosePreMadeDrinks: function(){

        },


        showTab: function (tab) {
            console.log(tab);
            this.hideAllTabs();
            if (tab === "sizePage") {
                this.showSizePage = true;
            }
            else if (tab === "abortOrder") {
                this.showStartPage = true;
            }
            else if (tab === "ingredPage") {
                if (drink.type == "juice") {
                    this.showJuiceIngredPage = true;
                }
                else if (drink.type == "smoothie") {
                    this.showSmoothieIngredPage = true;
                }
                this.showTopBar = true;
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

        },

        closeIngredMenus: function() {
            this.showButtonBox = false;
            console.log("Closed menus");
        },

        showIngredients: function(ingredTyp) {
            this.showButtonBox = true;
            if (ingredTyp === "base") {
                this.chosenCatName = "base"; 
                this.showIngredientsButtons = true;
                this.showCatButtons = false;
            }
            else if (ingredTyp === "ingredCat") {
                this.chosenCatName = "";
                this.showCatButtons = true;
                this.showIngredientsButtons =false;
            }
            else {
                this.chosenCatName = "topping"; 
                this.showIngredientsButtons = true;
                this.showCatButtons = false;
            }
        },


        addType: function(drinkType) {
            drink.type = drinkType;
            console.log("Du har valt drycktypen " + drink.type);
        },

        addSize: function(drinkSize) {
            drink.size = drinkSize;
            console.log("Du har valt storlek " + drink.size);
        },


        addToOrder: function (item) {
            this.chosenIngredients.push(item);
            console.log("entered addtoorder");
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
        },
}
});


// End Vue


//vm.test=vm.get_categories();
