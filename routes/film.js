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
// GET all films
router.get('/films', passport.authenticate('jwt', { session: false }), (req, res) => {
Films.find()
    .then((films) => {
    res.status(201).json(films);
    })
    .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
    });
});


// GET a single film by title
router.get('/films/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
Films.findOne({ Title: req.params.Title })
    .then((film) => {
    res.json(film);
    })
    .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
    });
});



router.post('/users/:Username/films/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $addToSet: { Favorites: req.params._id } // Replaced $push so it cannot be added several times
    },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
        });
});




    // DELETE a favorite film
router.delete('/users/:Username/films/:_id', passport.authenticate('jwt', { session: false }), (req, res) => {
Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { Favorites: req.params._id }
},
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
    if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    } else {
        res.json(updatedUser);
    }
    });
});



router.get('/users/:Username/favorites', passport.authenticate('jwt', { session: false }), (req, res) =>{
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
        res.json(user.Favorites);
        })
        .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
        });
    });


    router.post('/films/:filmId/comment', passport.authenticate('jwt', { session: false }), (req, res) => {
        const comment={
            text:req.body.text,
            postedBy:req.body.userId
        }
        Films.findBYIdAndUpdate(req.params.filmId, {
            $addToSet: { Comments: comment } // Replaced $push so it cannot be added several times
        },
            { new: true }, // This line makes sure that the updated document is returned
            (err, updatedFilm) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedFilm);
            }
            });
    });


    router.post('/films/:filmId/rate', passport.authenticate('jwt', { session: false }), (req, res) => {
        const rate={
            rate:req.body.rate,
            postedBy:req.body.userId
        }
        Films.findByIdAndUpdate(req.params.filmId, {
            $addToSet: { Rates: rate } // Replaced $push so it cannot be added several times
        },
            { new: true }, // This line makes sure that the updated document is returned
            (err, updatedFilm) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedFilm);
            }
            });
    });
    

    router.get('/api/films/recent', (req, res) => {
        Films.find().sort({ createdAt: -1 }).limit(10)
            .then(films => {
                res.status(201).json(films)
    
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });
    
    
    router.get('/api/films/recommended', (req, res) => {
        Films.find()
            .populate('rates.postedBy')
            .then(films => {
                films.sort((a, b) => getHighestRate(b.rates) - getHighestRate(a.rates));
                res.json(films.slice(0, 10)); // Limit to top 10
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });

    module.exports = router