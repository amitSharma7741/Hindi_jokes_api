const mongoose = require('mongoose');

const usePerSchema = new mongoose.Schema({

    date:{
        type: String,
        default: "2022-11-26"
    },
    count:  {
        type: Number,
        default: 0
    },
    usageAccount: {
        type:Array,
        default: []
    }
});

const usePerDay = mongoose.model('USEPERDAY', usePerSchema);

module.exports = usePerDay;
