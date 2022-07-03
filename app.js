require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initializing express app
const app = express();

// Handling cors errors
app.use(cors());

// Extracting json data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes here


let server;
// Connecting to database
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        // Starting server
        server = app.listen(process.env.PORT);
    })
    .then(() => {
        // consoling result
        console.log('Connected to database and server started at port ', process.env.PORT);
    })
    .catch(err => {
        console.log(err);
    });