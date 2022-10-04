 
const express = require('express');
const router = express.Router();
const path = require('path');
require("../DB/conn"); // connection to database
const Data = require("../Model/dataSchema"); // import dataSchema

const staticPath = path.join(__dirname, "../public"); // to get the path of public folder
router.use(express.static(staticPath)); // to use the static files

router.get('/', (req, res) => {
    res.send("Hello from the server router");


    // res.send("Hello from the server router");
}
);



router.get('/jokes', (req, res) => {
    const Joke = Data.find() // to find all the data in the database

    Joke.then((result) => {

        const joke = result[Math.floor(Math.random() * result.length)]; // to get a random joke from the database

        //  remove key from object

        const { _id, jokeContent, jokeNo } = joke;

        const jokeOurOfNo = jokeNo; // to get the joke number

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
});
 */

router.get('/jokes/:count', (req, res) => {
    const count = req.params.count;
    if (count <= 50) {

        // count = 5
        const joke = Data.find()
        joke.then((result) => {

            const jokeCount = Math.ceil(result.length / count);
            //     joke Count = 100/5 == 20  > 18
            // const jokeCount2 = jokeCount - 2;
            const randval = Math.floor(Math.random() * jokeCount ) + 1;
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
                    totalJokes:count,
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