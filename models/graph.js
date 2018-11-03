

var mongoose = require("mongoose")

var hike = mongoose.model("hike",{
    time:{
        type:String,
    },
    legend1:{
        type:Number
    }
    ,legend2:{
        type:Number
    },
    legend3:{
        type:Number
    }
})

module.exports = {hike}
