var mongoose = require("mongoose")

var graph = mongoose.model("graph",{
    username:String,
    legend1_name:String,
    legend2_name:String,
    legend3_name:String,
    length:Number,
    allGraphs:String,
    graphType:String,
    numberprefix:String,
    xAxisName:String,
    yAxisName:String
})

module.exports = {graph}