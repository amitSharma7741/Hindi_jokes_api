

const Auth = require('../Model/authSchema');


const authenticateKey = (req, res, next) => {
    // https://hindi-jokes-api.onrender.com/jokes?api_key=ab2c6905fdabed98a0b0da63c0c9 
    //  we get this api key from the url
    const apiToken = req.query.api_key; // to get the api key from the url
    // console.log(apiToken);

    const account = Auth.findOne({ apiToken: apiToken }); 
    // console.log(account);
 
    if (account) {
        let today = new Date().toISOString().split("T")[0]; // get today's date 2022-11-26
        let usage = account.usage?.find((date) => date.date === today); // find today's date in usage array
        //    usage output {date: "2022-11-26", count: 1} 
        //  first check usage is exist or not in the array
 

        // let usage = account.usage.findIndex((day) => day.date == today);

        //    usage output 0
        if (usage) {
            usage.count += 1; // increment count by 1
            next(); 
        } else {
            account.usage?.push({ date: today, count: 1 }); // add today's date to usage array
            next();
        }
        // save the all changes 
        // TypeError: Cannot read property 'count' of undefined 
        // solve this error
        
        // console.log(usage?.count);
        
    } else {
        res.status(401).send({
            "status": "error",
            "message": "Invalid api key"
        })
    }
}


module.exports = authenticateKey;
