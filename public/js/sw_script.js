/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';

//kommentar
/*längre kommentar*/
//newOrder



// GEMENSAMMA

// Detta är tidigare funktion för tabarna
/*function showTab(link) {
    window.location.href = link;
}/*/

//Detta är tidigare funktion för "new order tab"
/*function openInNewTab(link) {
    //var win = window.open(link, '_blank');
    window.location.href = "sw_new_order.html";
    var tab = window.open(link);
    //raden under sätter nya taben i fokus.
    tab.focus();
}*/

/*function createButton(buttonName) {
    var btn = document.createElement();
    document.body.appendChild(btn);
}*/

// SLUT GEMENSAMMA FUNKTIONER

// NEW ORDER START
// SLUT NEW ORDER FUNKTIONER

// ORDER QUEUE START
function pressedCancelOrder() {
    window.alert("du har tryckt på Cancel order");
}

function pressedFinishOrder() {
    window.alert("du har tryckt på Finish order");
}

// SLUT ORDER QUEUE FUNKTIONER

// ORDER HISTORY START


//document.getElementById("oHJuicesInOrder").onclick = function() {pressedOHJuicesInOrder()};
 function pressedOneOrder(){
     window.alert("du har tryckt på en order. den känner inte av vilken");
     addJuiceToMiddle();

 }

function addJuiceToMiddle(){
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
        document.getElementById("oQIngridients").classList.toggle("hide");
    }
}

function typeTextToDiv(text, div_id) {
    var aVariable = document.getElementById(div_id);
    aVariable.innerHTML += text;
}

function putDivIntoDiv() {

}

function pressedButton() {
    document.getElementById("oHIngridients").classList.toggle("hide");
}


// SLUT ORDER HISTORY

// INVENTORY START

Vue.component('ingredient', {
  props: ['item', 'lang'],
  template: '<div> {{item["ingredient_"+ lang]}}, {{item.stock}} </div>'
});
//SLUT INVENTORY

//STATISTICS START
//STATISTICS SLUT




// INGRIDS TESTFUNKTIONER
// testar div

function functionTextTillDiv() {
    var variabelNamn = document.getElementById('testdiv');
    console.log(variabelNamn);
    variabelNamn.innerHTML += "Text som ploppar upp för att jag tryck på knappen. ";
}

function functionTömDiv() {
    var variabelNamn = document.getElementById('testdiv');
    variabelNamn.innerHTML = " ";
}

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



function sumbit() {
    document.getElementById("demo").innerHTML = "Hello";
}

Vue.component('order-item-to-prepare', {
    props: ['uiLabels', 'order', 'orderId', 'lang'],
    template: '<div>\
<order-item\
:ui-labels="uiLabels"\
:lang="lang"\
:order-id="orderId"\
:order="order">\
</order-item>\
<button v-on:click="orderDone">\
{{uiLabels.ready}}\
</button>\
</div>',
    methods: {
    orderDone: function () {
    this.$emit('done');
},
              cancelOrder: function () {

}
}
});


// Start Vue: DETTA KAN NOG TAS BORT
/* Vue.component('ingredient', {
    props: ['item', 'lang'],
    template: ' <button class="ingredient" v-on:click="addIngredientToDrink"> {{item["ingredient_"+ lang]}} </button>',
    methods: {
        addIngredientToDrink: function () {
            this.$emit('addIngredient');
        },
    }
}); */


var vm = new Vue({
    el: '#main',
    mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
    data: {
        newOrderShow: false,
        orderQueueShow: true,
        orderHistoryShow: false,
        inventoryShow: false,
        statisticsShow: false,

    },
    methods: {
        markDone: function (orderid) {
            socket.emit("orderDone", orderid);
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
            }
            else if (tab === "orderQueue") {
                this.orderQueueShow = true;
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