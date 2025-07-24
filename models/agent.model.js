const mongoose = require("mongoose")

const agentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comments: [{
        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead"

        },
        commentsObj: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }]

    }]
})

const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;