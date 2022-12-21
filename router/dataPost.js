const express = require("express");
const router = express.Router();
const path = require("path");
// const bcrypt = require('bcrypt');
const crypto = require("crypto"); // for generating random string
const nodemailer = require("nodemailer");
//  define fs module
const fs = require("fs");

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 1000, // 15 seconds
  max: 50, // limit each IP to 100 requests per windowMs
  message:
    "Too many accounts created from this IP, please try again after a short while",
  headers: true,
  handler: function (req, res, next, options) {
    res.status(options.statusCode).json({
      status: "error",
      message: options.message,
      retryAfter: options.windowMs / 1000,
    });
  },
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD, // naturally, replace both with your real credentials or an application-specific password
  },
});

require("../DB/conn"); // connection to database
const Data = require("../Model/dataSchema"); // import dataSchema
const Auth = require("../Model/authSchema"); // import authSchema
const usePerDay = require("../Model/totalUsePerDay"); // import usePerDaySchema
// const apiAuthCheck = require("./apiAuth"); // import apiAuth.js file

const staticPath = path.join(__dirname, "../public"); // to get the path of public folder
router.use(express.static(staticPath)); // to use the static files

var title = 0;
const updateUsage = (apiKey) => {
  Auth.findOne({ apiToken: apiKey }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const today = new Date().toISOString().split("T")[0]; // to get the current date

      //  console.log(data);

      const usage = data.usage; // get the usage array
      // console.log(usage);
      //  if usage not prsent in the database then create a new array
      if (usage.length == 0) {
        Auth.updateOne(
          { apiToken: apiKey },
          {
            $set: {
              usage: [
                {
                  date: today,
                  count: 1,
                },
              ],
            },
          },
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              console.log("Usage updated", data);
            }
          }
        );
      } else {
        const usageDate = usage[0].date; // get the date from the usage array
        const usageCount = usage[0].count; // get the usage count from the usage array
        //  if usageCount print undefined

        if (usageDate != today) {
          Auth.updateOne(
            { apiToken: apiKey },
            {
              usage: [
                {
                  date: today,
                  count: 1,
                },
              ],
            },
            (err, data) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Usage updated", data);
              }
            }
          );
        } else {
          Auth.updateOne(
            { apiToken: apiKey },
            {
              usage: [
                {
                  date: today,
                  count: usageCount + 1,
                },
              ],
            },
            (err, data) => {
              if (err) {
                console.log(err);
              } else {
                console.log("Usage updated", data);
              }
            }
          );
        }

        sampleFun(data.usage);
      }
    }
  });
};

// update how many times the api is used per day
const updateUsePerDay = async (apiKey) => {
  const today = new Date().toISOString().split("T")[0]; // to get the current date
  
  const data = await Auth.findOne({ apiToken: apiKey });
  const emailId = data.email;
  const emailCount = data.usage[0].count; 
  usePerDay.findOne({ date: today }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data) { 
        const usageAccount = data.usageAccount;
        // also sort the array of objects in descending order of count

        const index = usageAccount.findIndex((item) => item.emailId == emailId);
        // console.log(index);

        if (index == -1) {
          usePerDay.updateOne(
            { date: today },
            {
              $set: { count: data.count + 1 },
              $push: { usageAccount: { emailId: emailId, count: emailCount } }, 
            },
            (err, data) => {
              if (err) { console.log(err); } 
              else {  console.log("Usage updated", data); }
            }
          );
        } else {
          usePerDay.updateOne(
            { date: today, "usageAccount.emailId": emailId },
            {
              $set: {
                count: data.count + 1,
                "usageAccount.$.count": emailCount,
              },
            },
            (err, data) => {
              if (err) {  console.log(err); } 
              else { console.log("Usage updated", data); }
            }
          );
        }

    //    sort the array of objects in descending order of count
    usePerDay.updateOne(
        { date: today },
        {
            $set: { usageAccount: usageAccount.sort((a, b) => b.count - a.count) },
        },
        (err, data) => {
            if (err) {  console.log(err); } 
            else {  console.log("Usage updated", data); }
        }
    ); 
      } else {
        usePerDay.create(
          {
            date: today,
            count: 1,
            usageAccount: [
              {
                emailId: emailId,
                count: 1,
              },
            ],
          },
          (err, data) => {
            if (err) { console.log(err); } 
            else {  console.log("Usage updated", data);  }
          }
        );
      }
    }
  });
};

const sampleFun = (ran) => {
  // console.log(ran);
  title = ran;

  return ran;
};

router.use((req, res, next) => {
  const apiKey = req.query.api_key;
  // console.log(apiKey);
  // apik key needed only for get request
  if (req.method == "GET") {
    //  use apiAuthCheck middleware
    // apiAuthCheck(req, res, next);

    Auth.findOne({ apiToken: apiKey }, (err, data) => {
      if (err) {
        res.status(401).send({
          status: "error",
          message: "Something went wrong",
          data: err,
        });
      } else if (data) {
        // update usage
        updateUsage(apiKey);
        updateUsePerDay(apiKey);

        next();
      } else {
        res.status(401).send({
          status: "error",
          message: "Invalid api key",
        });
      }
    });
  } else {
    next();
  }
});

router.get("/", (req, res) => {
  // get query string

  res.send("Hello from the server router");
});

router.get("/jokes", limiter, (req, res) => {
  const Joke = Data.find(); // to find all the data in the database

  Joke.then((result) => {
    const joke = result[Math.floor(Math.random() * result.length)]; // to get a random joke from the database

    //  remove key from object

    const { _id, jokeContent, jokeNo } = joke;

    const jokeOurOfNo = jokeNo; // to get the jokes number

    res.send({
      _id,
      status: "Success",
      jokeContent,
      jokeNo: jokeOurOfNo,
      usage: [
        {
          date: title[0].date,
          count: title[0].count,
        },
      ],
      created_by: "Amit Sharma",
    });
    // res.send(joke);
  }).catch((err) => {
    res.send(err);
  });
});

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

router.post("/register", limiter, async (req, res) => {
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
        message: "You already have an API Key",
      });
    } else {
      const generatedApiToken = crypto.randomBytes(14).toString("hex");

      const user = new Auth({
        email: email,
        apiToken: generatedApiToken,
      });
      const result = await user.save();
      res.status(201).json({
        apiKey: generatedApiToken,
        message: "Your API Key is generated successfully",
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "API Key",
        text: `Your API Key is ${generatedApiToken}`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/sendOtp", limiter, async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP",
      text: `Your OTP is ${otp}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(200).json({
      otp: otp,
      message: "OTP is sent to your email",
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/jokes/:count", limiter, (req, res) => {
  const count = req.params.count;
  if (count <= 50) {
    // count = 5
    const joke = Data.find();
    joke
      .then((result) => {
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

        res.send({
          status: "Success",
          created_by: "Amit Sharma",
          totalJokes: count,
          usage: [
            {
              date: title[0].date,
              count: title[0].count,
            },
          ],
          data: data,
        });
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    res.send("Max limit is 50");
  }
});

router.get("/sendGreetings", async (req, res) => {
  try {
    const emailTemplate = path.join(__dirname, "../views/email-template.html");
    const allEmails = [];
    const emails = await Auth.find();

    emails.forEach((email) => {
      allEmails.push(email.email);
    });
    console.log(allEmails[0]);
    //  we want to send html file in email
    //  we use views folder to store html file

    const mailOptions = {
      from: process.env.EMAIL,
      to: allEmails[69],
      subject: "Greetings",
      html: fs.readFileSync(emailTemplate, { encoding: "utf-8" }),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }

  res.send("Email sent");
});

router.get("*", (req, res) => {
  res.send(" 404 Error No page found");
});

module.exports = router;
