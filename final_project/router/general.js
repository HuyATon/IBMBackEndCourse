const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  console.log(req.body)
  const {username, password} = req.body

  if (username === undefined || password === undefined) {
    res.json({
      message: "Error: username or password is empty"
    })
  }
  else {
    if (isValid(username)) {

      const newUser = {
        username: username,
        password: password
      }
      users.push(newUser)
      res.json({
        message: "Successfully register"
      })
    }
    else {
      res.json({
        message: "Error: username is not valid"
      })
    }
  }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  new Promise((resolve, reject) => {
    resolve(books)
  })
      .then((books) => {
        res.json(JSON.stringify(books))
      })
      .catch((error) => {
        res.json({
          error: error
        })
     })

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn)

  new Promise((resolve, reject) => {
    resolve(books[isbn])
  })
      .then(book => res.json(book))
      .catch(error => res.json({error: error}))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase()

  new Promise((resolve, reject) => {
    let filteredBooks = []

    for (let booksKey in books) {
      if (books[booksKey].author.toLowerCase() === author) {
        filteredBooks.push(books[booksKey])
      }
    }
    resolve(filteredBooks)
  })
      .then(books => res.json(
          JSON.stringify(books)
      ))
      .catch(error => res.json({error: error}))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase()


  new Promise((resolve, reject) => {
    let filteredBooks = []
    for (let booksKey in books) {
      if (books[booksKey].title.toLowerCase() === title) {
        filteredBooks.push(books[booksKey])
      }
    }
    resolve(filteredBooks)
  })
      .then(filteredBooks => res.json(filteredBooks))
      .catch(error => res.json({
        error: error
      }))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn)
  const review = books[isbn].reviews
  res.json(JSON.stringify(review))
});

module.exports.general = public_users;
