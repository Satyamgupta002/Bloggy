const mongoose = require("mongoose")

async function connectDB (url) {
    try {
        const connectionInstance = await mongoose.connect(url)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error){
        console.log("MONGODB connection error",error)
        process.exit(1)
    }
}

module.exports = {connectDB}