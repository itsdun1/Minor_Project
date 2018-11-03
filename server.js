var express = require("express");
var mongoose = require("./database_connection/conn")
var {hike} = require("./models/graph");

var app = express()

hike.insertMany(
    [
      {
        "time": "Jan", "legend1" : 64.72, "legend2": 52.49,"legend3": 38.33
      },
      {
        "time": "Feb", "legend1" : 62.81, "legend2": 50.72,"legend3": 38.33
      },
      {
        "time": "Mar", "legend1" : 66.18, "legend2": 54.06,"legend3": 37.33
      },
      {
        "time": "Apr", "legend1" : 65.17, "legend2": 51.74,"legend3": 58.33
      },
      {
        "time": "May", "legend1" : 72.94, "legend2": 57.23,"legend3": 34.33
      },
      {
        "time": "Jun", "legend1" : 73.77, "legend2": 55.83,"legend3": 47.33
      },
      {
        "time": "Jul", "legend1" : 70.7, "legend2": 52.59,"legend3": 48.49
      },
      {
        "time": "Aug", "legend1" : 66.72, "legend2": 47.54,"legend3": 57.54
      },
      {
        "time": "Sept", "legend1" : 64.61, "legend2": 47.02,"legend3": 56.4
      }
    ]).then((data)=>{
        if(data)
        {
            console.log(data)
        }

    }).catch((e)=>{
        console.log(e)
    })


    // console.log("server is running");


function getData(responceObj)
{
hike.find({}).then((data)=>{

    if(data)
    {
        // console.log(data)
        var timeArray = []
        var legend1Prices = []
        var legend2Prices = [];
        var legend3Prices = [];
       

        for ( index in data){
          var doc = data[index];
         
          var time = doc['time'];
       
          var legend1 = doc['legend1'];
         
          var legend2 = doc['legend2'];

          var legend3 = doc['legend3'];
          timeArray.push({"label": time});
          legend1Prices.push({"value" : legend1});
          legend2Prices.push({"value" : legend2});
          legend3Prices.push({"value" : legend3})
        }

        var dataset = [
          {
            "seriesname" : "legend1 Price",
            "data" : legend1Prices
          },
          {
            "seriesname" : "legend2 Price",
            "data": legend2Prices
          },
        {
            "seriesname": "legend3 Price",
            "data": legend3Prices
        }
        ];

        var response = {
          "dataset" : dataset,
          "categories" : timeArray
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

res.render("home.ejs")

})

app.get('/getgraphs',(req,res)=>{
    res.render("commonforall.ejs")
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
  

   