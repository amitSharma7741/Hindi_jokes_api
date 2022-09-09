const mongoose = require('mongoose');


const dbUrl = process.env.DATABASE;
/* 
const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true, 
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Connection Successful');
    } catch (error) {
        console.log('No Connection');
    }
}



module.exports = connectDB; */
mongoose.connect(dbUrl)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Error : Could not connect to MongoDB...', err));

