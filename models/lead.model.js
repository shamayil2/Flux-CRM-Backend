const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    salesAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent"
    },
    status: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        required: true
    }],
    timeToClose: {
        type: Number,
        required: true
    },
    priority: {
        type: String,
        required: true
    }

})


const Lead = mongoose.model("Lead", leadSchema)

module.exports = Lead;