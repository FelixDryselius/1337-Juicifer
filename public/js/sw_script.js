/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';


// GEMENSAMMA
var currentSuperOrder;
// SLUT GEMENSAMMA FUNKTIONER

// NEW ORDER START
// SLUT NEW ORDER FUNKTIONER

// ORDER QUEUE START
function pressedCancelOrder() {
    var x = document.getElementById("myCheck").checked;
    if (x == true){
        document.getElementById("temo").innerHTML = x;
}
    }



function pressedFinishOrder(size) {
}


/*Hur skriver man ut variablerna size härifrån?*/
Vue.component('juices', {
    props: ['uiLabels', 'drink', 'orderId', 'lang'],
    template: '<div class="oneJuice"> <h2> info {{this.size}},{{this.done}}</h2> </div>\
<div>\
<order-item\
:ui-labels="uiLabels"\
:lang="lang"\
:order-id="orderId"\
:order="order">\
</order-item>\
<button v-on:click="showRecipe">\
{{uiLabels.ready}}\
</button>\
</div>',
    methods: {
        showRecipe: function () {
            window.alert("visa recept");
        }
    }
});


// SLUT ORDER QUEUE FUNKTIONER

// ORDER HISTORY START


//document.getElementById("oHJuicesInOrder").onclick = function() {pressedOHJuicesInOrder()}

function addJuiceToMiddle() {
    var variabelNamn = document.getElementById('oQJuicesInOrder');
    variabelNamn.innerHTML += "skriv ut specifika juicen";
}

function pressedOHJuicesInOrder(tabSelector) {
    // typeTextToDiv('1 x L Applejuice', 'oHJuicesInOrder');
    if (tabSelector == "orderHistory") {
        console.log("tryckt på juicesinorder från history");
        document.getElementById("oHJuicesInOrder").classList.toggle("pressedDiv");
        document.getElementById("oHIngridients").classList.toggle("hide");

    } else if (tabSelector == "orderQueue") {
        console.log("tryckt på juices från queue");
        document.getElementById("oQJuicesInOrder").classList.toggle("pressedDiv");

    }
}

function typeTextToDiv(text, div_id) {
    var aVariable = document.getElementById(div_id);
    aVariable.innerHTML += text;
}


// SLUT ORDER HISTORY

// INVENTORY START


Vue.component('ingredient', {
    props: ['item', 'lang'],
    template: '<div class = "database">\
<table width="100%" border="0" cellspacing="0" cellpadding="0" >\
<td  width="15%"> {{item["ingredient_"+ lang]}}</td>\
<td width="15%"> {{item["JU_volume"]}} {{item["JU_unit"]}} / {{item["balance_unit"]}} </td>\
<td width="15%"> {{item.stock}} JU </td>\
<td width="15%">  {{(item.stock/item.balance_unit_to_ju_unit).toFixed(1)}}  {{item["balance_unit"]}} </td>\
<td width="15%"> <input type = "text" id="changeBalance" v-model="newValueInput"> </td>\
<td width="25%"> \
<input type="button" value = "submit" v-on:click="changeBalance()" class="SubmitButton"></td>\
</table>\
</div>',


    data: function () {

        return {
            newValueInput: ''
        }
    },

    methods: {
        changeBalance: function () {

            this.$emit("set-temp-id");
            this.$emit("new-balance-set", this.newValueInput);
            this.newValueInput = "";
        },
    }
})
//SLUT INVENTORY



var vm = new Vue({
    el: '#main',
    mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
    data: {
        newOrderShow: false,
        orderQueueShow: true,
        orderHistoryShow: false,
        inventoryShow: false,
        statisticsShow: false,
        hideRightBox: false,
        hideRightBoxHistory: false,
        hideMiddleBox: false,
        selectedSuperOrder: {},
        selectedSuperOrderHistory: {},
        transChange: {},
        tempId: -1

    },


    methods: {
        getIngredData: function() { 
            var ingredArray = [['Ingrediens', 'Saldo']];
            for (var i = 1; i < this.ingredients.length/10; i++) {
                ingredArray.push([this.ingredients[i].ingredient_sv, this.ingredients[i].balance]);
            }
            console.log(ingredArray);


            return ingredArray;
        },
       
        markDone: function (orderid) {
            socket.emit("orderDone", orderid);
        },
        hideRightSideBoxToggle: function () {
            this.hideRightBox = !this.hideRightBox;
        
        },

        hideRightSideBoxToggleHistory: function () {
            this.hideRightBoxHistory = !this.hideRightBoxHistory;
        },
        
        hideMiddleBoxToggleHistory: function () {
            this.hideMiddleBox = !this.hideMiddleBox;
        },
        
        pressedFinishOrder: function (thisSuperOrder) {
        var x = document.getElementById("myCheck").checked;
        if (x == true){
        this.superOrders[thisSuperOrder.orderId].done = true;
        this.selectedSuperOrder.drinks = null;
}
    
  
},

        showSuperOrderContent: function (thisSuperOrder) {
            this.selectedSuperOrder = thisSuperOrder;
        },
        showSuperOrderContentHistory: function (thisSuperOrder) {
            this.selectedSuperOrderHistory = thisSuperOrder;
        },
   
        setTempId: function(tId){
            this.tempId = tId - 1;
        },
        newBalanceFunction: function(nBalance){ 
            console.log("This is nBalance: " + nBalance)
            console.log("this is tempID: " + this.tempId)
            console.log(this.ingredients[this.tempId].balance_unit_to_ju_unit);
            this.transChange[this.tempId] = Number(nBalance) * this.ingredients[this.tempId].balance_unit_to_ju_unit -this.ingredients[this.tempId].stock;
            console.log(this.transChange[this.tempId]);

            socket.emit("newInventory", {newBalance:this.transChange});
            console.log("did emit");
            this.transChange={};
        },

        hideAllTabs: function () {
            this.newOrderShow = false;
            this.orderQueueShow = false;
            this.orderHistoryShow = false;
            this.inventoryShow = false;
            this.statisticsShow = false;
        },
        showTab: function (tab) {
            this.hideAllTabs();
            if (tab === "newOrder") {
                this.newOrderShow = true;
                var newTab = window.open("localhost:3000/");
                //raden under sätter nya taben i fokus.
                tab.focus();
            } else if (tab === "orderQueue") {
                this.orderQueueShow = true;
            } else if (tab === "orderHistory") {
                this.orderHistoryShow = true;
            } else if (tab === "inventory") {
                this.inventoryShow = true;
            } else if (tab === "statistics") {
                this.statisticsShow = true;
            }

        },

        filtered_ingredients: function (cat) {
            return this.ingredients.filter(function (item) {
                return item["ingredient_cat"] === cat;
            })
        }
    }});
/*--------------Rita grafer------------*/
google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);


function drawChart() {
    var ingredientData = google.visualization.arrayToDataTable(vm.getIngredData());
    var ingredientOptions = {
        title: 'Fördelning av beställda ingredienser'
    };
    console.log(ingredientData);
    var chart = new google.visualization.PieChart(document.getElementById('chart'));
    chart.draw(ingredientData, ingredientOptions);
}



/*****************TESTER****************/

// Test för att skapa divar dynamiskt
/*function showOrders(){
    window.alert("test");
    var ordersRutan = document.createElement("oQMenu");
    ordersRutan.id='block';
    document.getElementsById('body')[0].appendChild(iDiv);

    var innerDiv = document.createElement('div');
    innerDiv.clasName = 'oneOrder';

    ordersRutan.appendChild(innerDiv);
}*/