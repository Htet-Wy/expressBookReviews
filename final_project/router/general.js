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

  if(!isValid(username)) {
    return res.status(409).json({message: "Username already exists."})
  } 
    users.push({username, password});
  return res.status(200).json({message: "User registered successfully."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let getBooksPromise = new Promise ((resolve, reject) => {
    resolve(books)
  });

  getBooksPromise.then(bookList => {
      console.log("Promise resolved")
      return res.status(200).send(bookList);
  }
).catch(
    err => {
        return res.status(500).json({message: "Failed to fetch books", error: err.message})
    }
)

    console.log("After calling promise")
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  let getBookDetailsPromise = new Promise ((resolve, reject) => {
    if(isbn) {
        resolve(books[isbn]);
    } else {
        reject(new Error("Book not found for the given ISBN"))
    }
  })

  getBookDetailsPromise.then(bookDetailsByIsbn => {
    console.log("Book is fetched")
    return res.status(200).send(bookDetailsByIsbn)
  }).catch(err => {
    return res.status(404).json({message: 'Failed to fetch book details', error: err.message})
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const keys = Object.keys(books);
  
  let getBooksByAuthorPromise = new Promise ((resolve, reject) => {
      let booksByAuthor = [];
      for(let key of keys) {
        if(books[key].author === author) {
            booksByAuthor.push(books[key]);
        } 
      }
      if(booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error("Cannot find books by this author"))
      }
  })

  getBooksByAuthorPromise.then(booksByAuthor => {
    console.log("Books by author fetched")
    res.status(200).send(booksByAuthor)
  }).catch(err => {
    res.status(404).json({message: "Books by author cannot find.", error: err.message})
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const keys = Object.keys(books);

  let getBooksByTitlePromise = new Promise ((resolve, reject) => {
      let booksByTitle = [];
    
      for(let key of keys) {
        if(books[key].title === title) {
            booksByTitle.push(books[key]);
        }
      }
    
      if(booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject(new Error ("No books found for this title"))
      }
  });

  getBooksByTitlePromise.then(booksByTitle => {
    console.log("fetched books by title");
    res.status(200).send(booksByTitle)
  }).catch(err => {
    res.status(404).json({message: 'No books found', error: err.message})
  })
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
