var express = require("express");
var mongoose = require("./database_connection/conn")
var {hike} = require("./models/graph");
var User = require("./models/user")
var bodyParser = require("body-parser")
var passport = require("passport")
var passportLocal = require("passport-local")
var passportLocalMongo = require("passport-local-mongoose")
var app = express();
app.use(bodyParser.urlencoded({extended:true}));



app.use(require("express-session")({
    secret: "this the bad 2",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    
    next();
  })








// hike.insertMany(
//     [
//       {
//         "username":"itsdun", "time": "Jan", "legend1" : 64.72, "legend2": 52.49,"legend3": 38.33
//       },
//       {
//        "username":"itsdun", "time": "Feb", "legend1" : 62.81, "legend2": 50.72,"legend3": 38.33
//       },
//       {
//         "username":"itsdun","time": "Mar", "legend1" : 66.18, "legend2": 54.06,"legend3": 37.33
//       },
//       {
//        "username":"itsdun", "time": "Apr", "legend1" : 65.17, "legend2": 51.74,"legend3": 58.33
//       },
//       {
//        "username":"itsdun", "time": "May", "legend1" : 72.94, "legend2": 57.23,"legend3": 34.33
//       },
//       {
//         "username":"itsdun","time": "Jun", "legend1" : 73.77, "legend2": 55.83,"legend3": 47.33
//       },
//       {
//        "username":"itsdun", "time": "Jul", "legend1" : 70.7, "legend2": 52.59,"legend3": 48.49
//       },
//       {
//        "username":"itsdun", "time": "Aug", "legend1" : 66.72, "legend2": 47.54,"legend3": 57.54
//       },
//       {
//        "username":"itsdun", "time": "Sept", "legend1" : 64.61, "legend2": 47.02,"legend3": 56.4
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


function getData(responceObj,username1)
{
hike.find({username:username1}).then((data)=>{
    
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

app.get("/fuelPrices",isLoggedIn,(req,res)=>{
    
   getData(res,res.locals.currentUser.username);

})

app.get("/getchart",(req,res)=>{
    res.render("chart")
})

app.get("/register",(req,res)=>{

    res.render("register.ejs")
})
app.post("/register",(req,res)=>{

    User.register(new User({username:req.body.username}),req.body.password,(err,data)=>{

        if(err)
        {
            console.log(err)
            return res.render("register.ejs")
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secret")
            
        })
    })
})


app.get("/login",(req,res)=>{

    res.render("login.ejs")
})

app.post("/login",(req,res,next)=>{

passport.authenticate("local",(err,user,info)=>{

    if(err)
    {
        return(next(err))
    }
    if(!user)
    {
        return res.redirect("/login")
    }
    req.logIn(user,function(err){
        if(err)
        {
            return next(err)
        }
        User.find({username:user.username}).then((data)=>{
            if(data)
            {
                console.log(data)
                return res.redirect('/secret/'+data[0]._id)
            }
        }).catch((e)=>{
            return next(e)
        })
        
    })

})(req,res,next);
});
app.get("/secret",isLoggedIn,(req,res)=>{
    

  
    res.render("secret.ejs")
    
    })

    app.get("/logout",(req,res)=>{
        req.logout();
        res.redirect("/")
    })



app.get("/secret/:id",isLoggedIn,(req,res)=>{


    
    User.findById(req.params.id).then((data)=>{
        if(data)
        {
            var username1 = data.username;
            // console.log(username1)
            console.log(res.locals.currentUser.username)
            hike.find({username:res.locals.currentUser.username}).then((data1)=>{
                if(data1)
                {   
                    dataset = data1
                    console.log(data1)
                }
              
            }).catch((e)=>{
                console.log(e)
                res.redirect("/")
            })
        }
       
      
        

    }).catch((e)=>{
        console.log(e)
        res.redirect("/")
    })
    console.log(req.params.id);
    res.render("myprofile.ejs")

})
























function isLoggedIn(req ,res ,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}

app.listen( 3000,()=>
{
    console.log("server has started");
})
  

   