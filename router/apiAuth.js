

const Auth = require('../Model/authSchema');


const authenticateKey = (req, res, next) => {
    const apiToken = req.headers.authorization;

    const account = Auth.findOne((user) => user.apiToken === apiToken);

    if (account) {
        let today = new Date().toISOString().split("T")[0]; // get today's date 2022-11-26
        let usage = account.usage.find((date) => date.date === today); // find today's date in usage array
        //    usage output {date: "2022-11-26", count: 1} 
        if (usage) {
            usage.count += 1; // increment count by 1
            next();
        } else {
            account.usage.push({ date: today, count: 1 }); // add today's date to usage array
            next();
        }
        // account.save(); // save the changes
        console.log(usage.count);
        
    } else {
        res.status(401).send({
            "status": "error",
            "message": "Invalid api key"
        })
    }
}


module.exports = authenticateKey;
