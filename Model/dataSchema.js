const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({

    jokeContent: {
        type: String,
        required: true,
        unique: true
    },
    jokeNo: {
        type: Number,
        required: true
    }

});

const Data = mongoose.model('JOKE', dataSchema);

module.exports = Data;