require('dotenv').config();
const express = require("express");

const bodyParser = require("body-parser");
const ejs=require("ejs");
const app = express();
const encrypt=require("mongoose-encryption");
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
const mongoose=require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});

const userSchmea=new mongoose.Schema({
    email:String,
    password:String
});

userSchmea.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchmea);

console.log(process.env.SECRET);
app.get("/",function(req,res){
    
    res.render("home");
});
app.get("/login",function(req,res){
    console.log("login");
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register",function(req,res){
    const newUser=new User({
       email:req.body.username,
       password:req.body.password
    });
    newUser.save();
    res.render("secrets");
});

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
     User.findOne({email:username},function(err,founduser){
         if(err){
                console.log(err);
         }
         else{
            if(founduser){
                if(founduser.password===password){
                    res.render("secrets");
                }
            }
         }

     })

  

});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
    });