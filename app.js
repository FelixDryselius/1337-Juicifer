/*jslint node: true */
/* eslint-env node */

//kommentar
//hej
//Farangis testing testing wiho
'use strict';

// Require express, socket.io, and vue
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var csv = require("csvtojson");

var ingredientsDataName = "ingredients";
var transactionsDataName = "transactions";
var defaultLanguage = "sv";

// Pick arbitrary port for server
var port = 3000;
app.set('port', (process.env.PORT || port));

// Serve static assets from public/
app.use(express.static(path.join(__dirname, 'public/')));
// Serve vue from node_modules as vue/
app.use('/vue', express.static(path.join(__dirname, '/node_modules/vue/dist/')));
// Serve cv.html as root page

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/cv.html'));
});
// Serve kitchen.html as subpage
app.get('/kitchen', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/kitchen.html'));
});

app.get('/sw', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/sw_start_page.html'));
});

app.get('/ordering', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/ordering.html'));
});

// Store data in an object to keep the global namespace clean
function Data() {

    this.data = {};
    this.superOrders = {};
    this.currentOrderNumber = 1000;
}

Data.prototype.getOrderNumber = function () {
    this.currentOrderNumber += 1;
    return this.currentOrderNumber;
}

Data.prototype.getUILabels = function (lang) {
    var ui = require("./data/ui_" + (lang || defaultLanguage) + ".json");
    return ui;
};

/* 
  Returns a JSON object array of ingredients with the fields from 
  the CSV file, plus a calculated amount in stock, based on
  transactions.
*/
Data.prototype.getIngredients = function () {
    var d = this.data;
    return d[ingredientsDataName].map(function (obj) {
        obj.stock = d[transactionsDataName].reduce(function (sum, trans) {
            if (trans.ingredient_id === obj.ingredient_id) {
                return sum + trans.change;
            } else {
                return sum;
            }
        }, 0);
        return obj;
    });
};

/* 
  Function to load initial data from CSV files into the object
*/
Data.prototype.initializeData = function (table) {
    this.data[table] = [];
    var d = this.data[table];

    csv({checkType: true})
        .fromFile("data/" + table + ".csv")
        .on("json", function (jsonObj) {
        d.push(jsonObj);
    })
        .on("end", function () {
        console.log("Data for", table, "done");
        //console.log(d);
    });
};

/*
  Adds an order to to the queue and makes an withdrawal from the
  stock. If you have time, you should think a bit about whether
  this is the right moment to do this.
*/
Data.prototype.addSuperOrder = function (recievedSuperOrder) {
    var orderId= this.getOrderNumber();

    this.superOrders[orderId] = recievedSuperOrder.superOrderProperties;  //this.superOrders[/*recievedSuperOrder.orderId*/orderId] = recievedSuperOrder.superOrderProperties; // så här såg den ut innan - Ingrid.

    this.superOrders[orderId].done = false; //this.superOrders[/*recievedSuperOrder.orderId*/orderId].done = false; //Så här såg den ut innan - Ingrid
    this.superOrders[orderId].orderId = orderId;

    return orderId;
};

Data.prototype.uppdateTransactions = function(change) {
    var newIngredBalance = change.newBalance;
    var transactions = this.data[transactionsDataName];
    var ingredKeys = this.newIngredBalance.keys();


    //if this is an inventory update
    if(change.inventoryChange){
        var d = this.data;

        var affectedIngredients =  d[ingredientsDataName].filter(function (ingred) {
            if(ingred.ingredient_id.indexOf(this.ingredKeys)!==-1) {
                return ingred;}
        }
        );
         }

                                                                 };

 Data.prototype.getAllSuperOrders = function () {
            return this.superOrders;
        };

        Data.prototype.markOrderDone = function (orderId) {
            this.superOrders[orderId].done = true;
        };


        var data = new Data();
        // Load initial ingredients. If you want to add columns, do it in the CSV file.
        data.initializeData(ingredientsDataName);
        // Load initial stock. Make alterations in the CSV file.
        data.initializeData(transactionsDataName);

        io.on('connection', function (socket) {
            // Send list of orders and text labels when a client connects
            socket.emit('initialize', { superOrders: data.getAllSuperOrders(),
                                       uiLabels: data.getUILabels(),
                                       ingredients: data.getIngredients() });

            // When someone orders something
            socket.on('superOrder', function (recievedSuperOrder) {
                var orderNumber = data.addSuperOrder(recievedSuperOrder);
                // send updated info to all connected clients, note the use of io instead of socket     
                socket.emit('orderNumber', orderNumber);
                io.emit('currentQueue', { superOrders: data.getAllSuperOrders(),
                                         ingredients: data.getIngredients() });
            });
            // send UI labels in the chosen language
            socket.on('switchLang', function (lang) {
                socket.emit('switchLang', data.getUILabels(lang));
            });
            // when order is marked as done, send updated queue to all connected clients
            socket.on('orderDone', function (orderId) {
                data.markOrderDone(orderId);
                io.emit('currentQueue', {superOrders: data.getAllSuperOrders() });
            });
            socket.on('newInventory',function({newBalance}){

            })
        });

        var server = http.listen(app.get('port'), function () {
            console.log('Server listening on port ' + app.get('port'));
        });
