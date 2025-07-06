const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"})
  }

  const userExists = users.filter(user => user.username === username);
  if(!userExists) {
    return res.status(409).json({message: "Username already exists."})
  } 
    users.push({username, password});
  return res.status(200).json({message: "User registered successfully."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn) {
    res.send(books[isbn]);
  } else {
    res.status(403).json({message: "Book not found for the given ISBN."})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const keys = Object.keys(books);
  let booksByAuthor = [];

  for(let key of keys) {
    if(books[key].author === author) {
        booksByAuthor.push(books[key]);
    } 
  }

  if(booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({message: "No books found for this author"})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const keys = Object.keys(books);
  let booksByTitle = [];

  for(let key of keys) {
    if(books[key].title === title) {
        booksByTitle.push(books[key]);
    }
  }

  if(booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({message: "No books found for this title"})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbnForReview = req.params.isbn;
  if(isbnForReview) {
    res.send(books[isbnForReview].reviews);
  } else {
    res.status(403).json({message : "No reviews for this book."})
  }
});

module.exports.general = public_users;
