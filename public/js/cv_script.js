'use strict';

var currentSuperOrder = new superOrder();

function superOrder() {
    this.drinks = [],
        this.activeDrink = 0,
        this.done = false,
        this.orderTime = [], 
        this.finishTime = null,
        this.orderId= -2
    /*Jag har gjort om orderTime och finishTime till en array med två index, för att kunna spara datum och tid separat. - Ingrid*/
};

function drink() {
    this.type = "",
        this.size = "U",
        this.ingredients = [0,0,0,0,0,0],
        this.prize = 0,
        this.aborted = false,
        this.tempId = -1 // vad ska denna variabel användas till? - Ingrid
};


//Att göra:
//funk: välja aktiv drink
//funk: markera order som done (gör i staff view)
//funk: sätta ordertid
//funk: sätta sluttid
//funk: lägga till ingrediens
//funk: sätta pris
//funk: markera som avbruten 
//The function that is activated when "cart" is pressed 

function createNewDrink(drinkType) { 
    var mydrink = new drink();
    mydrink.type = drinkType;
    currentSuperOrder.drinks.push(mydrink);
    currentSuperOrder.activeDrink = currentSuperOrder.drinks.length-1;

    //This is for checking that it works
    console.log(currentSuperOrder.drinks[currentSuperOrder.activeDrink].type);
};

function selectDrinkSize(inputSize) {
    currentSuperOrder.drinks[currentSuperOrder.activeDrink].size = inputSize;

    //This is for checking that it works
    console.log(currentSuperOrder.drinks[currentSuperOrder.activeDrink].size);
};

function deleteActiveDrink() {
    currentSuperOrder.drinks.splice(currentSuperOrder.activeDrink, 1);
}


function addIngredientToActiveDrink(ingred) {
    var tempActiveIngred = currentSuperOrder.drinks[currentSuperOrder.activeDrink].activeIngredient; currentSuperOrder.drinks[currentSuperOrder.activeDrink].ingredients[tempActiveIngred]=ingred; 

    //This is for checking that it works
    console.log(currentSuperOrder.drinks[currentSuperOrder.activeDrink].ingredients);
}

function addTimeStamp(){
    var date = new Date;

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    currentSuperOrder.orderTime[0]= year +"-"+ month +"-"+ day +" ";
    currentSuperOrder.orderTime[1]= hour +":"+min;
    console.log("Detta är orderTime[]: "+currentSuperOrder.orderTime);
    /*console.log(new Date(year, month, day, hour, min));*/
}




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

// Används getFlagSrc?? -Ingrid
function getFlagSrc(){ 
    var flagSrc = 'images/gb_flagga.png';
    console.log(flagSrc);
    return 'images/gb_flagga.png';
}

function sendCurrentSuperOrderToVue() {
    vm.vueSuperOrder = currentSuperOrder;
    currentSuperOrder = new superOrder();
}

// Start Vue:
Vue.component('ingredient', {
    props: ['item', 'lang'],
    template: ' <button class="ingredient" v-on:click="addIngredientToDrink"> {{item["ingredient_"+ lang]}} </button>',
    methods: {
        addIngredientToDrink: function () {
            this.$emit('add-ingredient');
        },
    }
});

var vm = new Vue({
    el: '#all_cv',
    mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
    data: {
        type: '',
        chosenIngredients: [],
        volume: 0,
        price: 0,

        showStartPage: true,
        showHelpLangContainer: true,
        showTopBar: true,
        showHelpAbortContainer: false,
        showTopBarButton: false,
        showSizePage: false,
        showIngredPage: false,
        showJuiceMug: false,
        showSmoothieMug: false,
        showButtonBox: false,
        showCatButtons: false,
        showIngredientsButtons: false,
        showCartPage: false,
        chosenCatName: '',
        searchTerm: '',
        vueSuperOrder: {}

    },
    created: function() {
        socket.on("orderNumber",function(orderNumber) {
            alert("Tack för din beställning. Ditt ordernummer är: " + orderNumber + "\
                Thank you for your order. Your order number is: " + orderNumber);
        });

    },


    methods: {
        hideAllTabs: function () {
            this.showStartPage = false;
            this.showHelpLangContainer = false;
            this.showHelpAbortContainer =false;
            this.showTopBarButton = false;
            this.showSizePage = false;
            this.showIngredPage = false;
            this.showJuiceMug = false;
            this.showSmoothieMug = false;
            this.showIngredientsButtons = false;
            this.showCartPage = false;
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
            console.log(tab)
            this.hideAllTabs();
            if (tab === "sizePage") {
                this.showSizePage = true;
                this.showHelpAbortContainer = true;
            }
            else if (tab === "abortOrder") {
                this.showStartPage = true;
                this.showHelpLangContainer = true;
            }
            else if (tab === "ingredPage") {
                if (currentSuperOrder.drinks[currentSuperOrder.activeDrink].type == "smoothie") {
                    this.showSmoothieMug = true;
                }
                else if (currentSuperOrder.drinks[currentSuperOrder.activeDrink].type == "juice") {
                    this.showJuiceMug = true;
                }
                this.showIngredPage = true;
                this.showTopBarButton = true;
                this.showHelpAbortContainer = true;
            }
            else if (tab === "cartPage") {
                this.showHelpAbortContainer = true;
                this.showCartPage =true;
                this.showTopBarButton = true;
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

        vueAddIngredientToActiveDrink: function(item){
            addIngredientToActiveDrink(item);
        },

        showIngredients: function(ingredTyp,pos) {
            this.showButtonBox = true;
            currentSuperOrder.drinks[currentSuperOrder.activeDrink].activeIngredient=pos; 
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


        placeSuperOrder: function () {
            addTimeStamp(); //spara tiden orden sickas.
            //So that the Vue element is updated
            sendCurrentSuperOrderToVue();
            // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)

            socket.emit('superOrder', {superOrderProperties: this.vueSuperOrder});

            //This is for checking that it works
            console.log("skickade superOrder");
            console.log(this.vueSuperOrder);

        },
    }
});

// End Vue

//vm.test=vm.get_categories();
