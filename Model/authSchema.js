const mongoose = require('mongoose');
// const validator = require('validator'); 
// const bcrypt = require("bcrypt")
const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    // api token
    apiToken: {
        type: String,
        required: true
    },
    usage: [
        {
            date:{
                type: String,
                default: "2022-11-26"
            } ,

            count:  {
                type: Number,
                default: 0
            }
        }
    ]


});

// hash the password before saving
/* authSchema.pre("save", async function(next){
    if(this.isModified("apiToken")){
        this.apiToken = await bcrypt.hash(this.apiToken, 10);
    }
    next();
})  */



const Auth = mongoose.model('AUTH', authSchema);

module.exports = Auth;


