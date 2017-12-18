/*jslint es5:true, indent: 2 */
/*global sharedVueStuff, Vue, socket */
'use strict';

//kommentar
/*längre kommentar*/


// GEMENSAMMA

function showTab(link) {
    window.location.href = link;
}

function openInNewTab(link){
    //var win = window.open(link, '_blank');
    window.location.href = "sw_new_order.html";
    var tab = window.open(link);
    //raden under sätter nya taben i fokus.
    tab.focus();
}

function createButton(buttonName) {
    var btn = document.createElement();
    document.body.appendChild(btn);
}

// SLUT GEMENSAMMA FUNKTIONER

// NEW ORDER START
// SLUT NEW ORDER FUNKTIONER

// ORDER QUEUE START
function pressedCancelOrder(){
    window.alert("du har tryckt på Cancel order");
}

function pressedFinishOrder(){
    window.alert("du har tryckt på Finish order");
}

// SLUT ORDER QUEUE FUNKTIONER

// ORDER HISTORY START

//document.getElementById("oHJuicesInOrder").onclick = function() {pressedOHJuicesInOrder()};


function pressedOHJuicesInOrder(tabSelector){
    // typeTextToDiv('1 x L Applejuice', 'oHJuicesInOrder');
    if (tabSelector == "orderHistory"){
        console.log("tryckt på juicesinorder från history");
        document.getElementById("oHJuicesInOrder").classList.toggle("pressedJucesInTheOrder");
        document.getElementById("oHIngridients").classList.toggle("hide");

    } 
    else if (tabSelector == "orderQueue"){
        console.log("tryckt på juices från queue");
        document.getElementById("oQJuicesInOrder").classList.toggle("pressedJucesInTheOrder");
        document.getElementById("oQIngridients").classList.toggle("hide");
    }       
}

function typeTextToDiv(text, div_id) {
    var aVariable = document.getElementById(div_id);
    aVariable.innerHTML+=text;
}

function putDivIntoDiv(){

}

function pressedButton(){
    document.getElementById("oHIngridients").classList.toggle("hide");
}


// SLUT ORDER HISTORY

// INVENTORY START
//SLUT INVENTORY

//STATISTICS START
//STATISTICS SLUT




// INGRIDS TESTFUNKTIONER
// testar div

function functionTextTillDiv() {
    var variabelNamn = document.getElementById('testdiv');
    console.log(variabelNamn);
    variabelNamn.innerHTML+="Text som ploppar upp för att jag tryck på knappen. ";
}

function functionTömDiv() {
    var variabelNamn = document.getElementById('testdiv');
    variabelNamn.innerHTML=" ";
}




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


var vm = new Vue({
  el: '#oQBoxContainer',
  mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
  methods: {
    markDone: function (orderid) {
      socket.emit("orderDone", orderid);
    }
  }
});