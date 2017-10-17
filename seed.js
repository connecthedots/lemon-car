var Cars = require("./models/car");

//Seed the database
module.exports = function(){
    Cars.create({
    model: "Toyota Corolla",
    image: "https://www.cstatic-images.com/stock/900x600/261868.jpg",
    color: "red",
    price: 14000,
    year: 2014,
    VIN: "asdofhasodifhaosdf1203912u3"
})
}