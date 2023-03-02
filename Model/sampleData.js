const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    jokeContent: {
        type: String,
        required: true,
        unique: true
    },
  Date: {
    type: Date,
    default: Date.now
    
  }
});

const sampleData = mongoose.model("SAMPLE", dataSchema);

module.exports = sampleData;
