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
        lang: "sv",
        categories: [],
        chosenLangIsSv: true
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