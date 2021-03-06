var express = require("express");
var mongoose = require("./database_connection/conn")
var {hike} = require("./models/graph");
var User = require("./models/user")
var bodyParser = require("body-parser")
var passport = require("passport")
var passportLocal = require("passport-local")
var passportLocalMongo = require("passport-local-mongoose")
var {graph} = require("./models/graph_info")
var active = require("./models/activelist")
var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
var flash = require("connect-flash")
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    
    next();
  })

//   active.insertMany({
//       username:"itsdun",
      
//   })

//   graph.findOneAndUpdate(
//     { username: "itsdun" }, 
//     { $push: { allGraphs: "the second" } },
//    function (error, success) {
//          if (error) {
//              console.log(error);
//          } else {
//              console.log(success);
//          }
//      });

// User.updateOne({currentActive:"thefirst"}).then((data)=>{
//     if(data)
//     {
//         console.log(data)
//     }
// }).catch((e)=>{
//     console.log(e)
// })

// graph.insertMany({
//     username:"itsdun",
//     legend1_name:"petrol",
//     legend2_name:"disel",
//     legend3_name:"rockel",
//     allGraphs:["thefirst"]
// }).then((data)=>{
//     if(data)
//     {
//         console.log(data)
//     }
// }).catch((e)=>{
//     console.log(e)
// })




// hike.insertMany(
//     [
//       {
//         "username":"itsdun", "time": "Jan", "legend1" : 64.72, "legend2": 52.49,"legend3": 38.33 ,"subname":"thefirst"
//       },
//       {
//        "username":"itsdun", "time": "Feb", "legend1" : 62.81, "legend2": 50.72,"legend3": 38.33 ,"subname":"thefirst"
//       },
//       {
//         "username":"itsdun","time": "Mar", "legend1" : 66.18, "legend2": 54.06,"legend3": 37.33 ,"subname":"thefirst"
//       },
//       {
//        "username":"itsdun", "time": "Apr", "legend1" : 65.17, "legend2": 51.74,"legend3": 58.33 ,"subname":"thefirst"
//       },
//       {
//        "username":"itsdun", "time": "May", "legend1" : 72.94, "legend2": 57.23,"legend3": 34.33 ,"subname":"thefirst"
//       },
//       {
//         "username":"itsdun","time": "Jun", "legend1" : 73.77, "legend2": 55.83,"legend3": 47.33 ,"subname":"thefirst"
//       },
//       {
//        "username":"itsdun", "time": "Jul", "legend1" : 70.7, "legend2": 52.59,"legend3": 48.49 ,"subname":"thefirst"
//       },
//       {
//        "username":"itsdun", "time": "Aug", "legend1" : 66.72, "legend2": 47.54,"legend3": 57.54 ,"subname":"thefirst"
//       },
//       {
//        "username":"itsdun", "time": "Sept", "legend1" : 64.61, "legend2": 47.02,"legend3": 56.4 ,"subname":"thesecond"
//       }
//     ]).then((data)=>{
//         if(data)
//         {
//             console.log(data)
//         }

//     }).catch((e)=>{
//         console.log(e)
//     })


//     console.log("server is running");


function getData(responceObj,username1,active,leg1,leg2,leg3,type,prefix,x,y)
{   console.log("hahaha"+active+"and thefirst")
// console.log(active.toString)
// console.log(type)
hike.find({username:username1,subname:active}).then((data)=>{
    
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

        dataset[0].seriesname = leg1
        dataset[1].seriesname = leg2
        dataset[2].seriesname = leg3

        var response = {
          "dataset" : dataset,
          "categories" : timeArray,
          "subname":active,
          "type":type,
          "prefix":prefix,
          "x":x,
          "y":y
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

app.engine('handlebars', exphbs({defaultLayout: 'main',
partialsDir: __dirname + '/views/partial/'}));
app.set('view engine', 'handlebars');


app.use('/public', express.static('public'));

app.get("/",(req,res)=>{
res.render("anim.ejs")


})
app.get("/graphs",(req,res)=>{

res.render("home.ejs")
// console.log(res.locals.getG)

})

app.get('/getgraphs',(req,res)=>{
    res.render("commonforall.ejs")
})

app.get("/fuelPrices",isLoggedIn,(req,res)=>{

    graph.find({username:res.locals.currentUser.username,allGraphs:res.locals.currentUser.currentActive}).then((data)=>{
        console.log(data)
        getData(res,res.locals.currentUser.username,res.locals.currentUser.currentActive,data[0].legend1_name,data[0].legend2_name,data[0].legend3_name,data[0].graphType,data[0].numberprefix,data[0].xAxisName,data[0].yAxisName);

    }).catch((E)=>{
        req.flash("error",E)
        console.log(E);
    })
    
   

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
            req.flash("error","user with same username already exist")
            return res.render("register.ejs")
        }
        passport.authenticate("local")(req,res,function(){
            active.insertMany({username:req.body.username})
            req.flash("success","successfully registered user")
            res.redirect("/secret/"+data._id)
            
        })
    })
})


app.get("/login",(req,res)=>{
    // console.log(res.locals.getG);
    // res.locals.getG = "aditya"
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
        req.flash("error","enter valid credentials")
        return res.redirect("/login")
    }
    req.logIn(user,function(err){
        if(err)
        {   
            req.flash("error",err)
            return next(err)
        }
        User.find({username:user.username}).then((data)=>{
            if(data)
            {
                // console.log(data)
                req.flash("success","Logged in as "+user.username)
                return res.redirect('/secret/'+data[0]._id)
            }
        }).catch((e)=>{
            
            return next(e)
        })
        
    })

})(req,res,next);
});
app.post("/secret",isLoggedIn,(req,res)=>{
    
    // graph.find({username:"itsdun"}).then((data)=>{
    //     if(data)
    //     {
    //         // console.log(data)
    //     }
    // }).catch((E)=>{
    //     console.log(E)
    // })
    // console.log(req.body.name + "ha ha ha")




    User.findOneAndUpdate({username:res.locals.currentUser.username},{
        $set:{currentActive:req.body.name}
    }).then((data)=>{

        if(data)
        {
            // console.log(data)

            res.render("chart",{   username:res.locals.currentUser.username,
                id:res.locals.currentUser._id,
            link:"/secret/"+res.locals.currentUser._id})
        }
    }).catch((E)=>{
        console.log(E)
    })
    // console.log(res.locals.currentUser.currentActive)

 
    
    })

    app.get("/logout",(req,res)=>{
        req.logout();
        req.flash("success","Logged You Out");
        res.redirect("/graphs")
    })



app.get("/secret/:id",isLoggedIn,(req,res)=>{

    active.find({username:res.locals.currentUser.username}).then((data)=>{

        console.log(data + "sakmdlasmdaskldalsmdasklcvmkalsmcdklklas")
      if(data[0].activeString && data[0].activeString.length)
            {   
                // console.log(data)
                res.render("dataShow.ejs",{data:data[0].activeString,
                username:data[0].username,
            id:"/secret/"+res.locals.currentUser._id+"/add"})
              
            }
            else{
                // console.log("not present")
                res.redirect("/secret/"+req.params.id+"/add")
            }
            


    }).catch((e)=>{
        console.log(e)
    })



    // User.findById(req.params.id).then((data)=>{
    //     if(data)
    //     {
    //         var username1 = data.username;
    //         // console.log(username1)
    //         // console.log(res.locals.currentUser.username)
    //         console.log(res.locals.currentUser)
    //         hike.find({username:res.locals.currentUser.username}).then((data1)=>{
    //             if(data1)
    //             {   
    //                 // dataset = data1
    //                 // console.log(data1)
    //             }
              
    //         }).catch((e)=>{
    //             console.log(e)
    //             res.redirect("/")
    //         })
    //     }
       
      
        

    // }).catch((e)=>{
    //     console.log(e)
    //     res.redirect("/")
    // })


    // console.log(req.params.id);
    // res.render("myprofile.ejs")

//     graph.find({username:res.locals.currentUser.username}).then((data)=>{
//         if(data){
//             console.log(data)
//             res.render("myprofile.ejs",{data:data[0].allGraphs,
//             id:res.locals.currentUser._id
//         })

//         }


// }).catch((e)=>{
//     console.log(e)
// })  


})


app.get("/secret/:id/add",(req,res)=>{

    res.render("addData.ejs",{id:req.params.id})

})

app.post("/secret/:id/add",(req,res)=>{
    x=[]
    console.log(req.body)
        for(var j=0;j<req.body.button;j++)
        {
            var obj = {};

                obj.username=res.locals.currentUser.username,
                obj.time=req.body.time.i[j],
                obj.legend1=req.body.legend1.i[j],
                obj.legend2=req.body.legend2.i[j],
                obj.legend3=req.body.legend3.i[j],
                obj.subname=req.body.button2
            x.push(obj)
        }

        // console.log(x)

        hike.insertMany(x).then((data)=>{
            if(data)
            {
                // console.log(data)
                
                res.redirect("/secret/"+res.locals.currentUser._id);

            }
        }).catch((e)=>{
            console.log(e)
        })

})


app.post("/secret/:id/addN",(req,res)=>{
    //  req.body.data
        // console.log(data)
        graph.insertMany({
    username:res.locals.currentUser.username,
    legend1_name:req.body.data.legend1_name,
    legend2_name:req.body.data.legend2_name,
    legend3_name:req.body.data.legend3_name,
    length:req.body.data.number,
    allGraphs:req.body.data.subname,
    graphType:req.body.data.graph,
    numberprefix:req.body.data.number_prefix,
    xAxisName:req.body.data.xaxis,
    yAxisName:req.body.data.yaxis

}).then((data)=>{
    active.findOneAndUpdate(
    { username: res.locals.currentUser.username }, 
    { $push: { activeString: req.body.data.subname } },
   function (error, success) {
         if (error) {
             console.log(error);
         } else {
             console.log(success);
         }
     });
    //  console.log(data)
     res.render("addNData.ejs",{data:data[0],
    id:res.locals.currentUser._id,
subname:req.body.data.subname})

}).catch((e)=>{
    console.log(e)
})

// graph.findOneAndUpdate(
//     { username: res.locals.currentUser.username }, 
//     { $push: { allGraphs: req.body.data.subname } },
//    function (error, success) {
//          if (error) {
//              console.log(error);
//          } else {
//              console.log(success);
//          }
//      });

    
        
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
  

   