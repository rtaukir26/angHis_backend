const mongoose=require("mongoose");
const dotenv = require("dotenv");
mongoose.set("strictQuery", false);
dotenv.config({ path: "./config.env" });

// mongoose.connect("mongodb://localhost:27017/indexp");
const connectDb = async () => {
    //   mongoose.connect("mongodb://127.0.0.1:27017/indexp").then(data=>{
    mongoose.connect(process.env.DATA_BASE_URL).then((data) => {
      console.log("db is running on :", data.connection.host);
    });
    //No need this catch function becoz we are handling the "Unhandled promise rejection" in server.js file
    // .catch((err) => {
    //   console.log("err", err);
    // });
  };
  module.exports = connectDb;