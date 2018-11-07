

var mongoose = require("mongoose")

var hike = mongoose.model("hike",{
    username:{
        type:String
    },
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
    },
    subname:String
})

module.exports = {hike}
