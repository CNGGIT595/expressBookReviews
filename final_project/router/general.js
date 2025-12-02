const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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
    return res.status(404).json({message: "Unable to register user - username and password must be provided."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        res.send(JSON.stringify(books,null,4));
        resolve("HTTP request to get all books data was successful.")       
    });   
    myPromise.then((successMessage) => {
        console.log("From Callback: " + successMessage)
        })
        .finally(() => {console.log("Cleanup complete");});
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);
    let myPromise = new Promise((resolve,reject) => {
        if (Number.isInteger(isbn) && isbn >= 1 && isbn <= 10) {
            res.send(JSON.stringify(books[isbn],null,4));
            resolve("HTTP request for getting the book details based on ISBN was successful.")  
        } else {
            res.status(300).send("A valid isbn in this app is integer 1 to 10 \n");
            reject("ISBN from user's query is invalid")
        }
    });
    myPromise
        .then((successMessage) => {console.log("From Callback: " + successMessage);})
        .catch((error) => {console.error("Error: ", error);})
        .finally(() => {console.log("Cleanup complete");});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorToFind = req.params.author;
    let foundResult = [];
    let myPromise = new Promise((resolve,reject) => {
        for (const key in books) {
            if (books[key].author === authorToFind) {        
                    foundResult.push(books[key]);  
            }
        }
        if (foundResult.length != 0) {
            res.send(JSON.stringify(foundResult,null,4));
            resolve(`HTTP request for getting the book details based on author "${authorToFind}" was successful.`) 
        } else {
            res.status(404).send(`No entry found with author "${authorToFind}".\n`);
            reject(`No entry found with author "${authorToFind}".\n`)
        }        
    });
    myPromise
    .then((successMessage) => {console.log("From Callback: " + successMessage);})
    .catch((error) => {console.error("Error: ", error);})
    .finally(() => {console.log("Cleanup complete");});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleToFind = req.params.title;
    let titleSearchResult = [];
    let myPromise = new Promise((resolve,reject) => { 
        for (const key in books) {
            if (books[key].title === titleToFind) {        
                    titleSearchResult.push(books[key]);  
            }
        }
        if (titleSearchResult.length != 0) {
            res.send(JSON.stringify(titleSearchResult,null,4));
            resolve(`HTTP request for getting the book details based on title "${titleToFind}" was successful.`) 
        } else {
            res.status(404).send(`No entry found with title "${titleToFind}".\n`);
            reject(`No entry found with title "${titleToFind}".\n`)
        }
    });
    myPromise
    .then((successMessage) => {console.log("From Callback: " + successMessage);})
    .catch((error) => {console.error("Error: ", error);})
    .finally(() => {console.log("Cleanup complete");});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);
    if (Number.isInteger(isbn) && isbn >= 1 && isbn <= 10) {
      res.send(JSON.stringify(books[isbn].reviews,null,4));
    } else {
      res.status(300).send("A valid isbn in this app is integer 1 to 10 \n");
    }
   });

module.exports.general = public_users;
