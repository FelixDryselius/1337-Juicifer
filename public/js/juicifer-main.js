/*jslint es5:true, indent: 2 */
/*global io, Vue */
/*exported sharedVueStuff */
'use strict';

var socket = io();

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

Vue.component('order-item', {
    props: ['uiLabels', 'order', 'orderId', 'lang'],
    template: '<div>{{orderId}} {{order.type}} {{uiLabels.ingredients}}: {{ order.ingredients.map(item=>item["ingredient_"+ lang]).join(", ") }} </div>'
});

// Stuff that is used both in the ordering system and in the kitchen
var sharedVueStuff = {
    data: {
        superOrders: {},
        uiLabels: {},
        ingredients: {},
        lang: "sv",
        categories: [],
        chosenLangIsSv: true
    },
    created: function () {
        socket.on('initialize', function (data) {
            this.superOrders = data.superOrders;
            this.uiLabels = data.uiLabels;
            this.ingredients = data.ingredients;
            for(var index in this.ingredients){
                if ((this.categories.indexOf(this.ingredients[index].ingredient_cat) === -1) && ["base","topping"].indexOf(this.ingredients[index].ingredient_cat) === -1) {           this.categories.push(this.ingredients[index].ingredient_cat);
    } }
        }.bind(this));

        socket.on('switchLang', function (data) {
            this.uiLabels = data;
        }.bind(this));

        socket.on('currentQueue', function (data) {
            this.superOrders = data.superOrders;
            if (typeof data.ingredients !== 'undefined') {
                this.ingredients = data.ingredients;
            }
        }.bind(this));
    },
    methods: {
        switchLang: function () {
            if (this.lang === "en") {
                this.lang = "sv";
                this.chosenLangIsSv = true;
                /*window.alert("du har bytt till svenska. Denna ruta och text skrivs ut från jucifer-main om du vill ta bort den.");*/
            } else {
                this.lang = "en";
                this.chosenLangIsSv = false;
                /*window.alert("du har bytt till ENGELSKA. Denna ruta och text skrivs ut från jucifer-main om du vill ta bort den.");*/
            }
            socket.emit('switchLang', this.lang);
        }


    }
};