

var mongoose = require("mongoose")

var hike = mongoose.model("hike",{
    month:{
        type:String,
    },
    petrol:{
        type:Number
    }
    ,diesel:{
        type:Number
    }
})

module.exports = {hike}
