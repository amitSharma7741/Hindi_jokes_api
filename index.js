const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

 
const corsOptions = {
    origin: 'https://hindi-jokes-api.onrender.com/',
    optionsSuccessStatus: 200,
    credentials: true

}

 app.use(cors(corsOptions));




const PORT = process.env.PORT || 5000;
const Data = require("./Model/dataSchema");
require("./DB/conn"); 
// const connectDB = require("./DB/conn");
 

app.use(express.json());
app.use(require("./router/dataPost"));
   
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
    }
);
 