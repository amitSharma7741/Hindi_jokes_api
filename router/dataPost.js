const { resolveSoa } = require('dns');
const express = require('express');
const router = express.Router(); 
const path = require('path');
require("../DB/conn");  
const Data = require("../Model/dataSchema");

const staticPath = path.join(__dirname, "../public"); 
router.use(express.static(staticPath));

router.get('/', (req, res) => {
    res.send("Hello from the server router");
     
    
    // res.send("Hello from the server router");
} 
);



router.get('/jokes', (req, res) => {
    const Joke = Data.find()

    Joke.then((result) => {

        const joke = result[Math.floor(Math.random() * result.length)];
        
        //  remove key from object

        const { _id, jokeContent, jokeNo } = joke;
         
        const jokeOurOfNo = jokeNo 
 
        res.send({ _id, status: "Success", jokeContent, jokeNo: jokeOurOfNo ,
    created_by:"Amit Sharma"});
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



router.get('*', (req, res) => {
    res.send(" 404 Error page");
      
});

module.exports = router;
