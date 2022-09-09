const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const PORT = process.env.PORT
const Data = require("./Model/dataSchema");
require("./DB/conn"); 
// const connectDB = require("./DB/conn");
 

app.use(express.json());
app.use(require("./router/dataPost"));
   
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
    }
);

 /* 
 const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const PORT = process.env.PORT
const User = require('./Model/userSchema');
require('./db/conn');
 
app.use(express.json());
//  import router
app.use(require('./router/auth'));

  
 app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
    }); */
