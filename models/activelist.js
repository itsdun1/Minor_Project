var mongoose = require("mongoose")
const arrayUniquePlugin = require('mongoose-unique-array');
// var active = mongoose.model("active",{
//     username:String,
//     activeString:[{type:String,unique:true}]
// })

var active = new mongoose.Schema({
    username:String,
    activeString:[{type:String,unique:true}]
})


active.plugin(arrayUniquePlugin)
module.exports = mongoose.model("active",active)