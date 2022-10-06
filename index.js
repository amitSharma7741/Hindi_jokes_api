const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // to use the environment variables

 


app.use(cors()); // to allow cross origin resource sharing

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // to allow cross origin resource sharing
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE,OPTIONS'); // to allow cross origin resource sharing
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // to allow cross origin resource sharing

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); // to allow cross origin resource sharing
        return res.status(200).json({});
    }
    next();
})


const PORT = process.env.PORT || 5000; // process.env.PORT is for render
const Data = require("./Model/dataSchema"); // import dataSchema
const Auth = require("./Model/authSchema"); // import authSchema

require("./DB/conn"); // connection to database

app.use(bodyParser.json()); // to parse the body of the request
app.use(bodyParser.urlencoded({ extended: true })); // to parse the body of the request

app.use(express.json()); // to parse the data in json format
//  add hbs as view engine
app.set('view engine', 'hbs');
app.use(require("./router/dataPost")); // import dataPost.js
 
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
}
);
