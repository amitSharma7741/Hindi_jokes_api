const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // to use the environment variables

 


app.use(cors()); // to allow cross origin resource sharing

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // to allow cross origin resource sharing
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // to allow cross origin resource sharing
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // to allow cross origin resource sharing
    next();
})


const PORT = process.env.PORT || 5000; // process.env.PORT is for render
const Data = require("./Model/dataSchema"); // import dataSchema
require("./DB/conn"); // connection to database

app.use(express.json()); // to parse the data in json format
app.use(require("./router/dataPost")); // import dataPost.js
 
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
}
);
