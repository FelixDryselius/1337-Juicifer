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
        this.ingredients = [0,0,0,0,0,0,0],
        this.price = 0,
        this.aborted = false,
        this.tempId = -1 // vad ska denna variabel användas till? - Ingrid
};

function createNewDrink(drinkType) { 
    var mydrink = new drink();
    mydrink.type = drinkType;
    currentSuperOrder.drinks.push(mydrink);
    currentSuperOrder.activeDrink = currentSuperOrder.drinks.length-1;

    //This is for checking that it works
    console.log(currentSuperOrder.drinks[currentSuperOrder.activeDrink].type);
}

function selectDrinkSizeAndPrice(inputSize) { //and sets price
    currentSuperOrder.drinks[currentSuperOrder.activeDrink].size = inputSize;

    switch(inputSize){
        case "S":
            currentSuperOrder.drinks[currentSuperOrder.activeDrink].price = 10;
            break;
        case "M":
            currentSuperOrder.drinks[currentSuperOrder.activeDrink].price = 20;
            break;
        case "L":
            currentSuperOrder.drinks[currentSuperOrder.activeDrink].price = 30;
            break;
    }

    console.log(currentSuperOrder.drinks[currentSuperOrder.activeDrink].size); //This is for checking that it works    
    console.log(currentSuperOrder.drinks[currentSuperOrder.activeDrink].price);
};


function deleteActiveDrink() {
    currentSuperOrder.drinks.splice(currentSuperOrder.activeDrink, 1);
}

/*function changeActiveDrink(){} KOMMER INTE ATT BEHÖVAS OM INTE FLERA DRINKAR KAN BESTÄLLAS*/

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

// Används denna funktion? - Ingrid
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// DETTA ÄR GAMLA GETORDERNR, TA BORT? INGRID?
function getOrderNumber() {
    // It's probably not a good idea to generate a random order number, client-side. 
    // A better idea would be to let the server decide.
    return "#" + getRandomInt(1, 1000000);
}

function checkActiveIngredButton(pos, type){
    var activeIngredButtonID;
    switch(pos){
        case 0:
            activeIngredButtonID = "topping"
            //console.log("case 0 - knappID: "+ activeIngredButtonID);
            break;
        case 1:
            activeIngredButtonID = "ingred1"
            //console.log("case 1 - knappID: "+ activeIngredButtonID);
            break;
        case 2:
            activeIngredButtonID = "ingred2"
            //console.log("case 2 - knappID: "+ activeIngredButtonID);
            break;
        case 3:
            activeIngredButtonID = "ingred3"
            //console.log("case 3 - knappID: "+ activeIngredButtonID);
            break;
        case 4:
            activeIngredButtonID = "ingred4"
            //console.log("case 4 - knappID: "+ activeIngredButtonID);
            break;
        case 5:
            activeIngredButtonID = "ingred5"
            //console.log("case 5 - knappID: "+ activeIngredButtonID);
            break;
        case 6:
            activeIngredButtonID = "baseIngred"
            //console.log("case 6 - knappID: "+ activeIngredButtonID);
            break;            
    }
    return activeIngredButtonID;
}

// Används getFlagSrc?? -Ingrid
function getFlagSrc(){ 
    var flagSrc = 'images/gb_flagga.png';
    console.log(flagSrc);
    return 'images/gb_flagga.png';
}

function sendCurrentSuperOrderToVue() {
    vm.vueSuperOrder = currentSuperOrder;
}

// Start Vue:                                                 
Vue.component('ingredient', {
    props: ['item', 'lang'],
    template: '<button class="ingredient" v-on:click="addIngredientToDrink" v-bind:style="getIngredientColor(item)"> {{item["ingredient_"+ lang]}} </button>',
    methods: {
        addIngredientToDrink: function () {
            this.$emit('add-ingredient');
        },
        getIngredientColor: function(aItem){
            var colorHex = aItem["hexColor"];
            return "background-color:" + colorHex;
        },
        data: function () {
            return {
                anItem: {}
            }
        },
    }
});

var vm = new Vue({
    el: '#all_cv',
    mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
    data: {
        showFooter: true,
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
        showSmoothieInCart: true,
        showJuiceInCart: false,
        showAllIngredientsButton: true,

        chosenCatName: '',
        searchTerm: '',
        vueSuperOrder: {},
        tempDrink: {},

        canPressCart:false,
        canPressPay: false,

        topping:"Topping", ////Dessa är för att ändra knapptext
        ingredient1:"Ingredient 1",
        ingredient2:"Ingredient 2",
        ingredient3:"Ingredient 3",
        ingredient4:"Ingredient 4",
        ingredient5:"Ingredient 5",
        base:"Base",

        toppingColor:"lightgrey",
        ingredient1Color:"3em solid lightgrey",
        ingredient2Color:"3em solid lightgrey",
        ingredient3Color:"3em solid lightgrey",
        ingredient4Color:"3em solid lightgrey",
        ingredient5Color:"3em solid lightgrey",
        baseColor:"6.8em solid lightgrey"
    },

    created: function() {
        socket.on("orderNumber",function(orderNumber) {
            alert(this.lang+"Tack för din beställning. Ditt ordernummer är: " + orderNumber +" Thank you for your order. Your order number is: " + orderNumber); //Jag får inte uiLabels att funka med alert, så därför skrivs båda språk ut.
            //          console.log(this.lang+" språk");
            //  console.log(this.uiLabels.base);
            location.reload(); //Reset sidan
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
            this.showSmoothieInCart = false;
            this.showJuiceInCart = false;
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
            this.showIngredientsButtons = true;
            this.showCatButtons = false;
            this.showAllIngredientsButton = false;
        },

        doShowIngredientsButtons: function(catName){
            this.showAllIngredientsButton = false;
            this.chosenCatName = catName;
            this.showCatButtons = false;
            this.showIngredientsButtons = true;
        },

        choosePreMadeDrinks: function(){

        },

        writeOutIngredients: function(aDrink){
            var aDrinksIngredient = {};
            console.log(aDrink)
            for(var el in aDrink.ingredients){
                if(aDrink.ingredients[el] === 0){
                    console.log(aDrink.ingredients[el]);
                }
                else{
                    console.log(aDrink.ingredients[el])
                    aDrinksIngredient[el] = aDrink.ingredients[el];}
            }
            console.log(aDrinksIngredient);
            return aDrinksIngredient
        },

        ingredientType: function(aKey){
            console.log("this is aKey" + aKey)
            if(aKey == 0){return "topping"}
            if(aKey == 6){return "bas"}
            else {return aKey}
        },

        showTab: function (tab) {
            //            console.log(this.ingredients[3].balance);
            console.log(tab)
            console.log(this.ingredients[0].stock);
            this.hideAllTabs();
            if (tab === "sizePage") {
                this.showSizePage = true;
                this.showHelpAbortContainer = true;
            }
            else if (tab === "abortOrder") {
                this.showStartPage = true;
                this.showHelpLangContainer = true;
                location.reload(); //Reset sidan
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
                sendCurrentSuperOrderToVue(); 
                this.showButtonBox=false;
                this.showHelpAbortContainer = true;
                this.showCartPage =true;
                this.showTopBarButton = true;
                if(this.checkIfMugIsFilled()){ //om true blir betalknapp grön.
                    this.canPressPay=true; //betalknapp blir grön.
                }
                this.canPressCart=false; //varukorgsknapp blir grå.
                if (currentSuperOrder.drinks[currentSuperOrder.activeDrink].type == "smoothie") { //är fer drycker ska kunna visas ska detta test öras i en loop på ett annat sätt.
                    this.showSmoothieInCart = true;
                    this.updateMugColors("smoothie");
                }
                else if (currentSuperOrder.drinks[currentSuperOrder.activeDrink].type == "juice") {
                    this.showJuiceInCart = true;
                    this.updateMugColors("juice");
                }
                console.log("Priset på aktiv dryck kostar: "+ currentSuperOrder.drinks[currentSuperOrder.activeDrink].price +":-");
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

        updateMugButton: function(){
            var activeIngredIndex = currentSuperOrder.drinks[currentSuperOrder.activeDrink].activeIngredient;  //this is a index in ingrediens-array
            var activeIngred = currentSuperOrder.drinks[currentSuperOrder.activeDrink].ingredients[activeIngredIndex]; 
            var activeIngredButtonID = checkActiveIngredButton(activeIngredIndex, activeType);
            var activeType = currentSuperOrder.drinks[currentSuperOrder.activeDrink].type;
            //console.log(activeType+": type");
            //console.log(activeIngredIndex+": activeIngredIndex");
            //console.log(activeIngred+": activeIngred");
            //console.log(activeIngredButtonID+": activeIngredButtonID");

            if (activeIngredButtonID=="topping"){
                this.toppingColor=activeIngred["hexColor"]; //sätter knappfärg på variabeln. Ändrar i updateMugColors();
                this.topping=activeIngred["ingredient_"+this.lang]; //Detta byter knapptext
            }
            else if(activeIngredButtonID=="baseIngred"){
                this.baseColor = "6.8em solid " + activeIngred["hexColor"]; //sätter knappfärg
                this.base=activeIngred["ingredient_"+this.lang]; //Detta byter knapptext
            }
            else {
                switch(activeIngredIndex){ //Denna swich byter knapptext
                    case 1:
                        this.ingredient1Color = "3em solid " + activeIngred["hexColor"];
                        this.ingredient1=activeIngred["ingredient_"+this.lang]; break;
                    case 2:
                        this.ingredient2Color = "3em solid " + activeIngred["hexColor"];
                        this.ingredient2=activeIngred["ingredient_"+this.lang]; break;
                    case 3:
                        this.ingredient3Color = "3em solid" + activeIngred["hexColor"];
                        if (activeType=="juice"){
                            this.ingredient3=activeIngred["ingredient_"+this.lang];
                        }
                        else {this.ingredient1=activeIngred["ingredient_"+this.lang];}
                        break;
                    case 4:
                        this.ingredient4Color = "3em solid" + activeIngred["hexColor"];
                        if (activeType=="juice"){
                            this.ingredient4=activeIngred["ingredient_"+this.lang];
                        }
                        else {this.ingredient2=activeIngred["ingredient_"+this.lang];}
                        break;
                    case 5:
                        this.ingredient5Color = "3em solid" + activeIngred["hexColor"];
                        if (activeType=="juice"){
                            this.ingredient5=activeIngred["ingredient_"+this.lang];
                        }
                        else {this.ingredient3=activeIngred["ingredient_"+this.lang];}
                        break;
                }
            }
            this.updateMugColors(activeType); //här ändras färgen. 
            console.log("Vald ingrediens: "+activeIngred["ingredient_"+this.lang]); //Skriver ut den valda ingrediensen.
        },

        checkIfMugIsFilled: function() {
            var type = currentSuperOrder.drinks[currentSuperOrder.activeDrink].type;
            if (type == "juice"){
                var stopAtIndex=5;
                var startIndex=0;
            }
            else { //är Smoothie
                var stopAtIndex=6;
                var startIndex=3;
                if (currentSuperOrder.drinks[currentSuperOrder.activeDrink].ingredients[0] == 0){ // Denna if-sats kollar om topping på index 0 är vald.
                    return false;
                }
            }
            var indexIngredient;
            var i;
            for (i = startIndex; i <= stopAtIndex; i++){
                indexIngredient = currentSuperOrder.drinks[currentSuperOrder.activeDrink].ingredients[i];
                if (indexIngredient == 0){ //är ingrediensen 0 finns det inget valt där.
                    return false;
                }
            }
            this.canPressCart=true; //Om funktionen inte returnat, sätts pressCart till true/grön.
            return true;
        },

        showIngredients: function(ingredTyp,pos) {
            this.showButtonBox = true;
            currentSuperOrder.drinks[currentSuperOrder.activeDrink].activeIngredient=pos; 
            if (ingredTyp === "base") {
                this.chosenCatName = "base"; 
                this.showIngredientsButtons = true;
                this.showCatButtons = false;
                this.showAllIngredientsButton = false;
            }
            else if (ingredTyp === "ingredCat") {
                this.chosenCatName = "ingredient";
                this.showCatButtons = true;
                this.showIngredientsButtons =false;
                this.showAllIngredientsButton = true;
            }
            else {
                this.chosenCatName = "topping"; 
                this.showIngredientsButtons = true;
                this.showCatButtons = false;
                this.showAllIngredientsButton = false;
            }
        },

        resetMugButtons: function() { //Används inte nu, men behövs när fler drycker kan beställas. //en knapp som inte finns (bas i en juice) kan inte kalas på. -Ingrid
            this.base= "Base";
            this.ingredient1="Ingredient 1";
            this.ingredient2="Ingredient 2";
            this.ingredient3="Ingredient 3";
            this.ingredient4="Ingredient 4";
            this.ingredient5="Ingredient 5";
            this.topping="Topping";
            document.getElementById("topping").style.backgroundColor = "lightgrey"; // byter knappfärg
            //  document.getElementById("ingred1").style.borderTop = "3em solid lightgrey"; // byter knappfärg
            //  document.getElementById("ingred2").style.borderTop = "3em solid lightgrey"; // byter knappfärg
            document.getElementById("ingred3").style.borderTop = "3em solid lightgrey"; // byter knappfärg
            document.getElementById("ingred4").style.borderTop = "3em solid lightgrey"; // byter knappfärg
            document.getElementById("ingred5").style.borderTop = "3em solid lightgrey"; // byter knappfärg
            document.getElementById("baseIngred").style.borderTop = "6.8em solid lightgrey"; // byter knappfärg
        },

        updateMugColors: function(type) { // byter knappfärg på alla knappar i rätt sorts mugg - Ingrid
            document.getElementById("topping").style.backgroundColor = this.toppingColor;
            if (type=="smoothie"){
                document.getElementById("baseIngred").style.borderTop = this.baseColor; 
            }
            else { //if (type == "juice")
                document.getElementById("ingred1").style.borderTop = this.ingredient1Color; 
                document.getElementById("ingred2").style.borderTop = this.ingredient2Color; 
            } 
            document.getElementById("ingred3").style.borderTop = this.ingredient3Color; 
            document.getElementById("ingred4").style.borderTop = this.ingredient4Color; 
            document.getElementById("ingred5").style.borderTop = this.ingredient5Color; 
        },

        placeSuperOrder: function () {
            addTimeStamp(); //spara tiden orden sickas. Ligger i jucifer-main. Bör användas till finish time också
            //So that the Vue element is updated
            sendCurrentSuperOrderToVue();

            // make use of socket.io's magic to send the stuff to the kitchen via the server (app.js)

            socket.emit('superOrder', {superOrderProperties: this.vueSuperOrder});

            //This is for checking that it works
            console.log("skickade superOrder");
            console.log(this.vueSuperOrder);

            currentSuperOrder = new superOrder();
            //this.resetMugButtons();
            this.canPressPay=false;
        },
    }
});

// End Vue
