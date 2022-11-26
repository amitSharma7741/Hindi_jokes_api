const express = require('express');
const router = express.Router();
const path = require('path');
// const bcrypt = require('bcrypt');
const crypto = require("crypto"); // for generating random string
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD // naturally, replace both with your real credentials or an application-specific password
    }
});


require("../DB/conn"); // connection to database 
const Data = require("../Model/dataSchema"); // import dataSchema
const Auth = require("../Model/authSchema"); // import authSchema
const apiAuthCheck = require("./apiAuth"); // import apiAuth.js file

const staticPath = path.join(__dirname, "../public"); // to get the path of public folder
router.use(express.static(staticPath)); // to use the static files
  
/* 
router.use((req, res, next) => {
    const apiKey = req.query.api_key;
    // apik key needed only for get request
    if (req.method == "GET") {
         
        Auth.findOne({ apiToken: apiKey }, (err, data) => {
            if (err) {
                res.status(401).send({
                    "status": "error",
                    "message": "Something went wrong",
                    "data": err

                }); 
            } else if (data) {
                next();
            } else { 
                res.status(401).send({
                    "status": "error",
                    "message": "Invalid api key"
                }); 
            }
        })
        
    } else {
        next();
    }
})

 */


router.get('/', (req, res) => {
    // get query string

    res.send("Hello from the server router");  
}
);



router.get('/jokes', apiAuthCheck  , (req, res) => { 
    const Joke = Data.find() // to find all the data in the database

    Joke.then((result) => {

        const joke = result[Math.floor(Math.random() * result.length)]; // to get a random joke from the database

        //  remove key from object

        const { _id, jokeContent, jokeNo } = joke;

        const jokeOurOfNo = jokeNo; // to get the jokes number

        res.send({
            _id, status: "Success", jokeContent, jokeNo: jokeOurOfNo,
            created_by: "Amit Sharma"
        });
        // res.send(joke);
    }
    ).catch((err) => {
        res.send(err);
    }
    );
}
);

/* router.post('/jokes', async (req, res) => {

    const { jokeContent } = req.body;
    const val = await Data.find();
    const val2 = val.length;
    const val3 = val2 + 1;
    const user = new Data({
        jokeContent: jokeContent,
        jokeNo: val3
    });
    try {
        const jokeExist = await Data.findOne({ jokeContent: jokeContent });
        if (jokeExist) {
            res.status(400).send("Joke already exist");
        } else {
            const result = await user.save();
            res.status(201).send(result);
        }
    } catch (error) {
        res.status(400).send(error);
    }
}); */

router.post('/register', async (req, res) => {
    const { email } = req.body;
    // generate api token use crypto module      


    try {
        const userExist = await Auth.findOne({ email: email }); // check if user already exist
        //  what will be userExist return value

        if (userExist) { 

            const { apiToken } = userExist;
            // res.status(200).send({ apiToken , message: "User already exist"});
            // use hbs to render the page
            // res.status(200).render("apiAuth", { 
            //     apiKey: apiToken, 
            //     message: "You already have an API Key"  
            // }); 
            res.status(200).json({
                apiKey: apiToken,
                message: "You already have an API Key"
            })
             

        } else {
            const generatedApiToken = crypto.randomBytes(14).toString("hex");
 
            const user = new Auth({
                email: email,
                apiToken: generatedApiToken
            });
            const result = await user.save();
             res.status(201).json( {
                apiKey: generatedApiToken,
                message:  "Your API Key is generated successfully"
            }); 
            const mailOptions = {
                from:  process.env.EMAIL,
                to: email,
                subject: 'API Key',
                text: `Your API Key is ${generatedApiToken}`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    } catch (error) {
        res.status(400).send(error);
    }
});


router.get('/jokes/:count', (req, res) => {
    const count = req.params.count;
    if (count <= 50) {

        // count = 5
        const joke = Data.find()
        joke.then((result) => {

            const jokeCount = Math.ceil(result.length / count);
            //     joke Count = 100/5 == 20  > 18
            // const jokeCount2 = jokeCount - 2;
            const randval = Math.floor(Math.random() * jokeCount) + 1;
            const data = [];
            for (let i = 1; i <= count; i++) {
                const val = result[randval * i];
                const { _id, jokeContent, jokeNo } = val;

                data.push({ _id, jokeContent, jokeNo });

            }

            res.send(
                {
                    status: "Success",
                    created_by: "Amit Sharma",
                    totalJokes: count,
                    data: data
                }
            );


        }).catch((err) => {
            res.send(err);
        }
        );
    } else {
        res.send("Max limit is 50");
    }

})

router.get('*', (req, res) => {
    res.send(" 404 Error No page found");

});

module.exports = router;