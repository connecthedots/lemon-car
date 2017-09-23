var Cars = require("./models/car");

//Seed the database
module.exports = function(){
    Cars.create({
    model: "Toyota Corolla",
    image: "https://images.unsplash.com/photo-1429081172764-c0ee67ab9afd?dpr=1.25&auto=format&fit=crop&w=600&h=400&q=80&cs=tinysrgb&crop=&bg=",
    price: 14000,
    year: 2014,
    VIN: "asdofhasodifhaosdf1203912u3"
})
}