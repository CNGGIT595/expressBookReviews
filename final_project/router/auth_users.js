const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in - username and password must be provided." });
    }
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);

    if (Number.isInteger(isbn) && isbn >= 1 && isbn <= 10) {
        let bookToReview = books[isbn];
        if (bookToReview) {
            let username = req.body.username;
            let reviewText = req.body.review;

            books[isbn].reviews[username] = reviewText;
        }
      res.send(JSON.stringify(books[isbn],null,4));
    } else {
      res.status(300).send("A valid isbn in this app is integer 1 to 10 \n");
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);

    if (Number.isInteger(isbn) && isbn >= 1 && isbn <= 10) {
        let bookToReview = books[isbn];
        let username = req.session.authorization.username;

        if (bookToReview) {            
            delete books[isbn].reviews[username];
        }
        res.send(`Review by user ${username} deleted as requested.`);
        //res.send(JSON.stringify(books[isbn],null,4));
    } else {
        res.status(300).send("A valid isbn in this app is integer 1 to 10 \n");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
