const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filteredBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author === author) {
      filteredBooks[isbn] = books[isbn];
    }
  });

  if (Object.keys(filteredBooks).length > 0) {
    return res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    return res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filteredBooks = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) {
      filteredBooks[isbn] = books[isbn];
    }
  });

  if (Object.keys(filteredBooks).length > 0) {
    return res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    return res.status(404).json({message: "No books found for this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Task 10: Get the list of books using an async callback function with Axios
async function getAllBooks(callback) {
  try {
    const response = await axios.get(BASE_URL + "/");
    callback(null, response.data);
    return response.data;
  } catch (error) {
    callback(error, null);
    throw error;
  }
}

// Task 11: Search by ISBN using Promises with Axios
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + "/isbn/" + isbn)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Task 12: Search by author using Promises with Axios
function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + "/author/" + encodeURIComponent(author))
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Task 13: Search by title using Promises with Axios
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    axios.get(BASE_URL + "/title/" + encodeURIComponent(title))
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
