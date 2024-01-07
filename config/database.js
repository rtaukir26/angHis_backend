const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async () => {
 try {
    const conn=await mongoose.connect(process.env.MONGODB_URL,{})
    console.log(`Connected to Mongodb Data base ${conn.connection.host}`)
    
 } catch (error) {
    console.log(`Error in MongoDB ${error}`)
    
 }
};

module.exports= connectDB;
