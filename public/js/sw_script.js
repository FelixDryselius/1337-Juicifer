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
    window.alert("du har tryckt på Cancel order");
}

function pressedFinishOrder(size) {
    window.alert("du har tryckt på Finish order");
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


//document.getElementById("oHJuicesInOrder").onclick = function() {pressedOHJuicesInOrder()};
function pressedOneSuperOrder(thisSuperOrder){
    /*window.alert("du har tryckt på en order. den känner inte av vilken");*/
    /* addJuiceToMiddle(tab); */
    console.log("order done? :"+thisSuperOrder.done);
    currentSuperOrder=thisSuperOrder;
    console.log("orderTime: "+currentSuperOrder.orderTime);
    console.log(thisSuperOrder);
    console.log(superOrders);
    /*this.$emit('done');*/

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


// SLUT ORDER HISTORY

// INVENTORY START

function changeBalanceButton() 
{
    var fname = $("#changeBalance").val();

    $("#balanceChanged").html(fname);
    $("p").hide()


}


Vue.component('ingredient', {
    props: ['item', 'lang'],
    template:  ' <div class = "database">\
<table width="100%" border="0" cellspacing="0" cellpadding="0" >\
<td  width="20%"> {{item["ingredient_"+ lang]}}</td>\
<td width="20%"> {{item["JU_volume"]}} mL </td>\
<td width="20%"> {{item["JU_volume" ]}} / {{item["balance"]}} L </td>\
<td width="20%"> {{item["balance"]}}<label id = "balanceChanged"></label> mL </td>\
<td width="20%"> <input type = "text" id="changeBalance"  onchange="ChangeBalanceButton(this.value)"> </td>\
</table>\
</div>',
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


// Start Vue:
/* Vue.component('ingredient', {
    props: ['item', 'lang'],
    template: ' < {{item["ingredient_"+ lang]}} >',
    methods: {
        addIngredientToDrink: function () {
            this.$emit('add-ingredient');
        },
    }
}); */


/*Vue.component('inventoryIngredient', {
  props: ['item', 'lang'],
  template: '<div> {{item["ingredient_"+ lang]}}, {{item.stock}} </div>'
});*/
/*Vue.component('inventoryStock', {
  template: '<div> text  </div>'
});*/

var vm = new Vue({
    el: '#main',
    mixins: [sharedVueStuff], // include stuff that is used both in the ordering system and in the kitchen
    data: {
        newOrderShow: false,
        orderQueueShow: true,
        orderHistoryShow: false,
        inventoryShow: false,
        statisticsShow: true,
        amountSmoothies: 0,
        amountJuices: 0
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
        //    getIngredientData: function (){
        //        var contentArr = [
        //            ['Ingrediens', 'Antal beställda']
        //        ];
        //        /*--- Initiera contentArr---*/
        //        for (var i = 0; i < this.ingredients.length; i ++){
        //            contentArr.push([this.ingredients[i].ingredient_sv, 0]);
        //        }
        //        /*--- Gå igenom ordrar, dess ingredienser och jämför---*/
        //        for (var i = 1; i < Object.keys(this.orders).length +1; i += 1) { //loopa över alla ordrar
        //            for (var j = 0; j < this.orders[i].ingredients.length; j++){ //loopa över varje orders ingredienser
        //                for (var k = 1; k < contentArr.length; k++){ //loopa över alla ingredienser
        //                    if (contentArr[k][0] == this.orders[i].ingredients[j].ingredient_sv){ //jämför
        //                        contentArr[k][1] ++;
        //                    }
        //                }
        //            }
        //        }
        //        /*---Rensa ut ingredienser som inte är beställda tillräckligt ofta--*/
        //        var m = 1;
        //        while (m < contentArr.length){
        //            if(contentArr[m][1] < 1){
        //                contentArr.splice(m,1);
        //            } else {m++;}
        //        }
        //        return (contentArr)
        //    },
        //   getCurrentStatus(){
        //     return this.orders;
        //   }

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

        },

        filtered_ingredients: function(cat) {
            return this.ingredients.filter(function(item) {
                return item["ingredient_cat"] === cat;
            })
        }
    }});
/*--------------Rita grafer------------*/
google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);

//function getColors(size){
//    var colors = [];
//    var red = 0;
//    var green = 140;
//    var blue = 0;
//    for (var i = 0; i < size; i ++){
//        var currColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
//        colors.push(currColor);
//        red += 5;
//        green += 2;
//        blue += 5;
//    }
//    //  console.log(colors);
//    return colors;
//
//}

function drawChart() {
    //    var orderData = google.visualization.arrayToDataTable(vm.getOrderData());
    //    var orderOptions = {
    //        title: 'Fördelning av beställningar',
    //        pieHole: 0.4,
    //        colors: ['rgb(255,51,153)', 'rgb(220,220,51)'],
    //        'backgroundColor':'transparent',
    //        'titleTextStyle': {color:'white', fontName: 'champagne__limousinesregular', fontSize:'20', bold:'false'},
    //        legend: {textStyle: {color: 'white', fontName: 'champagne__limousinesregular', fontSize:'16'}}
    //    };

    var ingredientData = google.visualization.arrayToDataTable(vm.getIngredData());
    var ingredientOptions = {
        title: 'Fördelning av beställda ingredienser'
//        pieHole: 0.4,
//        //        colors: getColors(dataVm.getIngredientData().length),
//        colors: ['rgb(0, 140, 0)', 'rgb(255,255,255)'],
//        'backgroundColor':'transparent',
//        'titleTextStyle': {color:'white', fontName: 'champagne__limousinesregular', fontSize:'20', bold:'false'},
//        legend: {textStyle: {color: 'white', fontName: 'champagne__limousinesregular', fontSize:'16'}},
//        pieResidueSliceLabel: 'Övriga',
//        //pieResidueSliceColor: '#365888',
//        sliceVisibilityThreshold: 6/100
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