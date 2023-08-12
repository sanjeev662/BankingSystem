require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port=process.env.PORT || 4500;

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const mongoURI = process.env.mongoURI
const connection=mongoose.connect(mongoURI,{useNewUrlParser:true});

const itemsSchema={   
    name:String,
    gender:String,
    age:String,
    password:String,
    money:Number,
    email:String,
    address:String
  };
  
  const Itema=new mongoose.model("Itema",itemsSchema);
  
  const item1=new Itema({
    "name": "sanjeev",
    "gender":"male",
    "age":"20",
    "password":"sanjeev",
    "money":345,
    "email": "sks@gmail.com",
    "address":"abc defghi"
  });
  
  const item2=new Itema({ 
    "name": "sanju",
    "gender":"male",
    "age":"22",
    "password":"sanju",
    "money":678,
    "email": "ss@gmail.com",
    "address":"abcddef"
  });
  
  const defaultItems=[item1,item2];

//for adding two default customer data

app.get("/manager",function(req,res)
{
Itema.find({},function(err,foundItems){

  if(foundItems.length==0){
    Itema.insertMany(defaultItems,function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Succesfully saved default items to DB.");
      }
    });
    res.redirect("/manager");
  }
  else{
    res.render("manager",{customer:foundItems});
  }
  });
});

//for adding new customer data

app.post("/register",function(req,res)
{  
  const item=new Itema({
    name:req.body.uname,
    gender:req.body.ugender,
    age:req.body.uage,
    password:req.body.psw,
    money:req.body.umoney,
    email:req.body.uemail,
    address:req.body.uaddress
  });
  item.save();
  console.log("Successfully added."); 
  res.redirect("/manager"); 
});

//for deleting customer data/account

app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
  
    Itema.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
        console.log("Successfully deleted checked item.");
        res.redirect("/manager");
      }
    });
  });

//for login authentication of customer

  app.post("/login",async(req,res) =>{
  
    try{
    const username=req.body.uname;
    const password=req.body.psw;
  
    const detail=await Itema.findOne({name:username});
  
      if(detail.password===password){
        
        res.status(201).render("customer",{customer:detail});
      }
      else{
        res.send("password are not matching");
      }
    }
      catch (error) {
        res.status(400).send("invalid email")
      }
    
  })
  
//roughly flow of data :
//home >> login customer >> with authentication >> customer account detail
//home >> login manager >> view customer detail >> can delete or add customer account 

  app.get("/",function(req,res)
  {
    res.render("home");
  })

  app.get("/login",function(req,res)
  {
    res.render("login");
  })

  app.get("/register",function(req,res)
  {
     res.render("register");
  })

  app.get("/customer",function(req,res)
  {
  res.render("customer");
  })

app.listen(port, function(){
    console.log("Server started successfully..");
  });