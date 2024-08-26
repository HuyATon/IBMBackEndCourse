const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  username: "abc",
  password: "abc"
}];

const isValid = (username)=>{ //returns boolean

  console.log(!users.some(user => user.username === username))
  console.log(users)
  return !users.some(user => user.username === username)
}

const authenticatedUser = (username,password)=>{ //returns boolean

  console.log(users)
  return users.filter(user => user.username === username && user.password === password).length === 1
}

//only registered users can login
regd_users.post("/login", (req,res) => {

  const { username, password } = req.body
  console.log(req.body)
  if (authenticatedUser(username, password)) {

    res.json({
      token: jwt.sign({username: username}, "SOME_SECRET")
    })
  }
  else {
    res.json({
      message: "Login Failed"
    })
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body
  console.log("New review:", review)

  const isbn = req.params.isbn

  if (books[isbn]) {
    const newReview = {
      username: req.user.username,
      review: review
    }

    if (books[isbn].reviews !== []) {
      books[isbn].reviews = books[isbn].reviews.filter(a => a.username !== req.user.username)
      books[isbn].reviews.push(newReview)
    }
    else {
      books[isbn].reviews = [newReview]
    }
    console.log(books[isbn].reviews)
    res.json({
      message: "Successfully add a new review"
    })
  }
  else {
    res.json({
      message: "Failed to add a new review"
    })
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = parseInt(req.params.isbn)
  console.log(books[isbn])

  if (books[isbn].reviews) {
    const filteredReviews = books[isbn].reviews.filter( review => review.username !== req.user.username)
    if (filteredReviews.length === books[isbn].reviews.length) {
      res.json({
        message: `Failed to delete: ${req.user.username} has no reviews before`
      })
    }
    else {
      books[isbn].reviews = filteredReviews
      res.json({
        message: `Successfully deleted review of ${req.user.username}`
      })
    }
  }
  else {
    req.json({
      message: "The isbn is invalid"
    })
  }
})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
