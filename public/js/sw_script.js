/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';


var currentSuperOrder;


// ORDER QUEUE START
function pressedCancelOrder() {
    var x = document.getElementById("myCheck").checked;
    if (x == true) {
        document.getElementById("temo").innerHTML = x;
    }
}


function pressedFinishOrder(size) { //Används denna funktion? -Ingrid
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
//Här tar vi fram information från databasen och ställer upp dem i en tabell

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
        orderQueueShow: true,
        oQButtonsShow: true,
        newOrderShow: false,
        orderHistoryShow: false,
        inventoryShow: false,
        hideRightBox: false,
        hideRightBoxHistory: false,
        hideMiddleBox: false,
        selectedSuperOrder: {},
        selectedSuperOrderID: -1,
        selectedSuperOrderIDHistory: -1,
        showSelectedOrderDrink: false,
        showSelectedOrderDrinkHistory: false,
        selectedSuperOrderHistory: {},
        transChange: {},
        tempId: -1

    },


    methods: {
        getTopping: function () {
            var ingredArray = [['Ingrediens', 'Mängd']];

            for (var i = 0; i < Object.keys(this.superOrders).length; i++) {
                var sizeLetter = this.superOrders[1001 + i].drinks[0].size;
                var size;
                if (sizeLetter == 'S') {
                    size = 1;
                } else if (sizeLetter == 'M') {
                    size = 2;
                } else {
                    size = 3;
                }
                ingredArray.push([this.superOrders[1001 + i].drinks[0].ingredients[0].ingredient_sv, (this.superOrders[1001 + i].drinks[0].ingredients[0].JU_volume) * size]);

            }
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


        //Klickfunktion till Order Queues vänstra spalt. Den tar med orderID så vi kan sätta den till "done"
        pressedFinishOrder: function (orderID) {
            // var x = document.getElementById("myCheck").checked; //Ingrid kommenterade bort. Ta bort?
            this.superOrders[orderID].done = true;
            console.log(this.superOrders[orderID].orderTime + ": order time");
            this.selectedSuperOrder.drinks = []; // Vad gör denna? -Ingrid

            socket.emit("orderDone", orderID);
        },

        //Samma funktion som ovan fast för Order History, och denna tar inte med den specifika IDn utan hela objektet för information.
        showSuperOrderContentHistory: function (thisSuperOrder) {
            console.log("showSuperOrderContentHistory")
            if (this.showSelectedOrderDrinkHistory == true) {
                console.log("showSuperOrderContentHistory if statement")
                this.showSelectedOrderDrinkHistory = false;
                return
            }
            console.log("showSuperOrderContentHistory normal")
            this.showSelectedOrderDrinkHistory = true;
            this.selectedSuperOrderHistory = thisSuperOrder;
            this.selectedSuperOrderIDHistory = thisSuperOrder.orderId;


        },


        //Klickfunktion till Order Queues vänstra spalt. Den tar med orderID så vi kan sätta den till "done"

        showSuperOrderContent: function (thisSuperOrder) {
            console.log("showSuperOrderContent")
            if (this.showSelectedOrderDrink == true) {
                console.log("showSuperOrderContent if statement")
                this.showSelectedOrderDrink = false;
                return
            }
            console.log("showSuperOrderContent normal")
            this.selectedSuperOrder = thisSuperOrder;
            this.selectedSuperOrderID = thisSuperOrder.orderId;
            this.showSelectedOrderDrink = true;
        },
        //Samma funktion som ovan fast för Order History, och denna tar inte med den specifika IDn utan hela objektet för information.

        showSuperOrderContentHistory: function (thisSuperOrder) {
            this.selectedSuperOrderHistory = thisSuperOrder;

            var aVariable = document.getElementById("oHTimeInfo");
            aVariable.innerHTML = "<br> Order Time: " + this.superOrders[thisSuperOrder.orderId].orderTime;
        },

        setTempId: function (tId) {
            this.tempId = tId - 1;
        },

        newBalanceFunction: function (nBalance) {

            console.log("This is nBalance: " + nBalance)
            console.log("this is tempID: " + this.tempId)
            console.log(this.ingredients[this.tempId].balance_unit_to_ju_unit);
            this.transChange[this.tempId] = Number(nBalance) * this.ingredients[this.tempId].balance_unit_to_ju_unit - this.ingredients[this.tempId].stock;
            console.log(this.transChange[this.tempId]);

            socket.emit("newInventory", {
                newBalance: this.transChange
            });
            console.log("did emit");
            this.transChange = {};
        },

        hideAllTabs: function () {
            this.orderQueueShow = false;
            this.oQButtonsShow = false;
            this.newOrderShow = false;
            this.orderQueueShow = false;
            this.orderHistoryShow = false;
            this.inventoryShow = false;
            hideStatistics();
        },

        showTab: function (tab) {
            document.getElementById('statistics').style.display = 'none';
            this.hideAllTabs();
            if (tab === "newOrder") {
                this.oQButtonsShow = true;
                this.newOrderShow = true;
                var newTab = window.open("localhost:3000/");
                //raden under sätter nya taben i fokus.
                tab.focus();
            } else if (tab === "orderQueue") {
                this.oQButtonsShow = true;
                this.orderQueueShow = true;
            } else if (tab === "orderHistory") {
                this.orderHistoryShow = true;
            } else if (tab === "inventory") {
                this.inventoryShow = true;
            } else if (tab === "statistics") {
                document.getElementById('statistics').style.display = 'block';
            }

        },

        filtered_ingredients: function (cat) {
            return this.ingredients.filter(function (item) {
                return item["ingredient_cat"] === cat;
            })
        }
    }
});
/*--------------Rita grafer------------*/
google.charts.load("current", {
    packages: ["corechart"]
});
google.charts.setOnLoadCallback(drawChart);

function hideStatistics() {
    document.getElementById('statistics').style.display = 'none';
};

function drawChart() {
    var toppingData = google.visualization.arrayToDataTable(vm.getTopping());
    var toppingOptions = {
        title: 'Fördelning topping'
    };
    var chartTopping = new google.visualization.PieChart(document.getElementById('toppingChart'));
    chartTopping.draw(toppingData, toppingOptions);
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
