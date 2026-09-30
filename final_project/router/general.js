const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User registered successfully"
    });
});

// Get all books
public_users.get('/', function (req, res) {

    return res.status(200).json(books);

});

// Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(books[isbn]);

});

// Get books by author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author.toLowerCase();

    const result = Object.keys(books)
        .filter(key => books[key].author.toLowerCase().includes(author))
        .reduce((obj, key) => {
            obj[key] = books[key];
            return obj;
        }, {});

    return res.status(200).json(result);

});

// Get books by title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title.toLowerCase();

    const result = Object.keys(books)
        .filter(key => books[key].title.toLowerCase().includes(title))
        .reduce((obj, key) => {
            obj[key] = books[key];
            return obj;
        }, {});

    return res.status(200).json(result);

});

// Get book review
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(books[isbn].reviews);

});

// Task 10: Axios methods

async function getAllBooks() {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
}

async function getBooksByISBN(isbn) {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return response.data;
}

async function getBooksByAuthor(author) {
    const response = await axios.get(
        `http://localhost:5000/author/${encodeURIComponent(author)}`
    );
    return response.data;
}

async function getBooksByTitle(title) {
    const response = await axios.get(
        `http://localhost:5000/title/${encodeURIComponent(title)}`
    );
    return response.data;
}

module.exports.getAllBooks = getAllBooks;
module.exports.getBooksByISBN = getBooksByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;

module.exports.general = public_users;