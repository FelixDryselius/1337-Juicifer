/*jslint es5:true, indent: 2 */
/*global io, Vue */
/*exported sharedVueStuff */
'use strict';

var socket = io();

Vue.component('order-item', {
    props: ['uiLabels', 'order', 'orderId', 'lang'],
    template: '<div>{{orderId}} {{order.type}} {{uiLabels.ingredients}}: {{ order.ingredients.map(item=>item["ingredient_"+ lang]).join(", ") }} </div>'
});

// Stuff that is used both in the ordering system and in the kitchen
var sharedVueStuff = {
    data: {
        orders: {},
        uiLabels: {},
        ingredients: {},
        lang: "en",
        categories: []
    },
    created: function () {
        socket.on('initialize', function (data) {
            this.orders = data.orders;
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
            this.orders = data.orders;
            if (typeof data.ingredients !== 'undefined') {
                this.ingredients = data.ingredients;
            }
        }.bind(this));
    },
    methods: {
        switchLang: function () {
            if (this.lang === "en") {
                this.lang = "sv";
            } else {
                this.lang = "en";
            }
            socket.emit('switchLang', this.lang);
        },

        superOrder: function() {
            this.drinks = [];
            this.activeDrink = 0;
            this.orderId = -1;
            this.done = false;
            this.orderTime = null;
            this.finishTime = null;
        },

        drink: function() {
            this.type = "";
            this.volume = 0;
            this.ingredients= [0,0,0,0,0];
            this.prize  = 0;
            this.aborted = false;
            this.tempId = -1;
        },
        
        //funk: lägga till en drink
        //funk: ta bort drink
        //funk: välja aktiv drink
        //funk: sätta orderid
        //funk:markera order som done
        //funk: sätta ordertid
        //funk: sätta sluttid
        //funk: välja drinktyp
        //funk: välja drinkstorlek
        //funk: lägga till ingrediens
        //funk: ta bort ingrediens
        //funk: sätta pris
        //funk: markera som avbruten 




    }
};