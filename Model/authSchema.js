const mongoose = require('mongoose'); 
const validator = require('validator');
// const bcrypt = require("bcrypt")
const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }

    },
    // api token
    apiToken: {
        type:String,
        required:true
    } 
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


 