const app = require("./app");
const connectDb = require("./config/dataBase");
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });

//connecting to Db
connectDb();
app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
