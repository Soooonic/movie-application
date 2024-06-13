const path = require("path");
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('../models.js');
const Films = Models.Films;
const Users = Models.User;

require('../helper.js')

let auth = require('./auth')(router); // Needs to be after the bodyParser middleware
const passport = require('passport');
require('./passport');
//user
router.post('/users',
    /* Validation logic as middleware, e.g. a chain of methods like .not().isEmpty() (=is not empty)
    or .isLength({min: 5}) */
    [
        check('Username', 'Username is required').isLength({ min: 8 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {
        let errors = validationResult(req);   // Checks the validation object for errors
    
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }
    
        let hashedPassword = Users.hashPassword(req.body.Password); // Password hashing
        Users.findOne({ Username: req.body.Username }) // Checks if a user with the requested username already exists
        .then((user) => {
            if (user) {
            return res.status(400).send(req.body.Username + 'already exists'); //If the user is found, sends a response that it already exists
            } else {
            Users
                .create({
                Username: req.body.Username,
                Password: hashedPassword, // Password hashing
                Email: req.body.Email,
                Birthday: req.body.Birthday
                })
                .then((user) => { res.status(201).json(user) })
                .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
                })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
    });

    module.exports = router