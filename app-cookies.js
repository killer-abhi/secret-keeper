//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

const session =require('express-session');
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');

const bcrypt = require("bcrypt");
const saltrounds = 10;

app.use(session({
    secret:"Any Long String",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());


const { MongoClient, ServerApiVersion } = require('mongodb');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

const url = "mongodb+srv://" + process.env.USER_NAME + ":" + process.env.ADMIN_PASSWORD + "@cluster0.ixadnkb.mongodb.net/userDB?retryWrites=true&w=majority";
// const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
mongoose.connect(url, function (err) {
    if (err) console.log(err)
    else console.log("mongdb is connected");
});

// mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


// const secret="Thisisourlittlesecret";
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function (req, res) {
    res.render("home");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/register", function (req, res) {
    res.render("register");
});
app.get("/secrets", function (req, res) {
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else{
        res.render("/login");
    }
    
});
app.listen(3000, function () {
    console.log("Server Started On Port 3000");
});

app.post("/register", function (req, res) {

    User.register({username:req.body.username},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){

            })
        }
    })

});
app.post("/login", function (req, res) {
    
});