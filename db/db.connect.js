const mongoose = require("mongoose")
require("dotenv").config()

const mongoUri = process.env.MONGODB

const initializeDatabase = async() => {
    try {
        await mongoose.connect(mongoUri)
            .then(() => console.log("Database is Connected"))
            .catch((error) => console.log(error))

    } catch (error) {
        console.log("Database failed to connect ", error)
    }
}

module.exports = { initializeDatabase };