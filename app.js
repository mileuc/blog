//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//create blogDB
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

//create schema for post documents in a posts collection
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

// create posts collection
const Post = mongoose.model("Post", postSchema);

//let posts = [];

// get request for root route
app.get("/", function(req, res) {
  let homepagePosts = []; // array that will contain posts to be rendered in home.ejs
  Post.find({}, function(err, foundPosts){
    if(!err){
      foundPosts.forEach(function(foundPost){
        homepagePosts.unshift(foundPost); // add latest posts to the beginning of the array
      });
      // console.log(homepagePosts);
      res.render("home", {startingContent: homeStartingContent, posts: homepagePosts});
    }
  });
});

// get request for about route
app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

// get request for contact route
app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent});
});

// get request for compose route
app.get("/compose", function(req, res) {
  res.render("compose");
});

// post request for compose route - adding a new post
app.post("/compose", function(req, res) {

  // create a new post from the title and content entered from the compose page
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  // save post into posts collection
  post.save(function(err){
    if(!err){
      res.redirect("/");  // if post is saved into the posts collection with no errors, redirect to root route
    }
  }); 
});

// visiting a page for an individual blog post
app.get("/posts/:postId", function(req, res) {
  // console.log(req.params.postName);
  const requestedId = req.params.postId;  // grab the id of the post that was clicked on

  // use the requestedId to find the corresponding stored post 
  Post.findOne({_id: requestedId}, function(err, foundPost) {
    if(!err) {
      const storedId = String(foundPost._id); //convert the found post to a String (orginally listed as object type)
      // console.log(typeof(foundPost.content));
      // console.log(typeof(requestedId));
      // console.log((requestedId));
      // console.log(typeof(storedId));
      // console.log((storedId));
      // console.log(storedId === requestedId);  
      if (storedId === requestedId) {   //if id of the found post matches the requested post, render it in post.ejs
        res.render('post', {title: foundPost.title, content: foundPost.content});
      }
    }
  });

  // homepagePosts.forEach(function(post) {
  //   const storedID = _.lowerCase(post._id);
  //   if (storedID === requestedID) {
  //     res.render('post', {title: post.title, content: post.content});
  //   }
  // });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
