var express = require("express");
var mongoose = require("./database_connection/conn")
var {hike} = require("./models/graph");

var app = express()

// hike.insertMany(
//     [
//       {
//         "month": "Jan", "petrol" : 64.72, "diesel": 52.49
//       },
//       {
//         "month": "Feb", "petrol" : 62.81, "diesel": 50.72
//       },
//       {
//         "month": "Mar", "petrol" : 66.18, "diesel": 54.06
//       },
//       {
//         "month": "Apr", "petrol" : 65.17, "diesel": 51.74
//       },
//       {
//         "month": "May", "petrol" : 72.94, "diesel": 57.23
//       },
//       {
//         "month": "Jun", "petrol" : 73.77, "diesel": 55.83
//       },
//       {
//         "month": "Jul", "petrol" : 70.7, "diesel": 52.59
//       },
//       {
//         "month": "Aug", "petrol" : 66.72, "diesel": 47.54
//       },
//       {
//         "month": "Sept", "petrol" : 64.61, "diesel": 47.02
//       }
//     ]).then((data)=>{
//         if(data)
//         {
//             console.log(data)
//         }

//     }).catch((e)=>{
//         console.log(e)
//     })


    // console.log("server is running");


function getData(responceObj)
{
hike.find({}).then((data)=>{

    if(data)
    {
        // console.log(data)
        var monthArray = []
        var petrolPrices = []
        var dieselPrices = [];
       

        for ( index in data){
          var doc = data[index];
         
          var month = doc['month'];
       
          var petrol = doc['petrol'];
         
          var diesel = doc['diesel'];
          monthArray.push({"label": month});
          petrolPrices.push({"value" : petrol});
          dieselPrices.push({"value" : diesel});
        }

        var dataset = [
          {
            "seriesname" : "Petrol Price",
            "data" : petrolPrices
          },
          {
            "seriesname" : "Diesel Price",
            "data": dieselPrices
          }
        ];

        var response = {
          "dataset" : dataset,
          "categories" : monthArray
        };

        // console.log(response);
        responceObj.json(response);

    }
   
}).catch((err)=>{
    if(err)
    {
        console.log(err)
    }
})
}


var exphbs  = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use('/public', express.static('public'));
app.get("/",(req,res)=>{

res.send("home")

})

app.get("/fuelPrices",(req,res)=>{
   getData(res);

})

app.get("/getchart",(req,res)=>{
    res.render("chart")
})





app.listen( 3000,()=>
{
    console.log("server has started");
})
  

   