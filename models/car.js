var mongoose = require("mongoose");

//Schema for lemons
var carSchema = new mongoose.Schema({
    model: {type:String, required: true},
    year: {type:Number, required: true},
    image: {type:String, required: true},
    color: {type:String, required: true},
    VIN: {type: String, required: true},
    price: {type: Number, required: true}
})

module.exports = mongoose.model("car", carSchema)