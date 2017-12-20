var superorder = {
    done: false,            //boolean, håller reda på om drinken skall ligga i orderkö eller historik.
    orderId : -1,           //int, tilldelas när ordern skickas från cv.
    drinks : [],            //En array av object som innehåller själva drinkarna.
    activeDrink : 0         //int. Index för den drink i arrayen drinks som kunden håller på att ändra.
    orderTime: "enTid"      //Tiden då ordern lades. Hur skall detta lagras?
}



var drink = {           //object
    ingredients: [],    //array med id för ingredienser
    volume: 0,          //int
    type : "",          //string
    prize : 0,          //int
    aborted: false      //boolean
}
