//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//lvl2 Encryption
//const encrypt = require("mongoose-encryption");
//Lvl 3 Encryption
//var md5 = require("md5");
const bcrypt = require('bcryptjs');
const saltround = bcrypt.genSaltSync(10);
const app = express();

console.log(process.env.API_KEY);


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
//Lvl2 Encryption
// var secret = process.env.SECRET;
//
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  bcrypt.hash(req.body.password, saltround, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save(function(err){
      if(err){
        console.log(err);
      } else{
        res.render("secrets");
      }
    });
  });

});

app.post("/login", function(req, res){

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser){  //you can use md5(msg),but we prefer above
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if(result === true){
            res.render("secrets");
          }
        });
      } else {
        res.send("/");
      }
    }
  });
});

app.listen(3000,function(){
  console.log("Server running on port 3000");
});
