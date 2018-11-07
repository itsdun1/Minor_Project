var mongoose = require("mongoose")

var active = mongoose.model("active",{
    username:String,
    activeString:[String]
})

module.exports = {active}