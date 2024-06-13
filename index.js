const path = require("path");
const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
require('./models')

// Middleware
app.use(bodyParser.json()); // Parsing JSON

// Importing Passport and auth
let auth = require('./auth')(app); // Needs to be after the bodyParser middleware
const passport = require('passport');
require('./passport');


app.use(require('./routes/auth.js'))
app.use(require('./routes/film.js'))


// Message upon hitting the root folder / home
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});


//server listen
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
console.log('Listening on Port ' + port);
});