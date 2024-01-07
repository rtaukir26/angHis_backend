const express = require("express");
const connectDB = require("./config/database");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoute");
const productRoute = require("./routes/productRoutes");
const postRoute = require("./routes/postRoute");
// const bodyParser = require("body-parser");

//configure env
dotenv.config();
//Db connect
connectDB();

const app = express();

//middkeware
app.use(cors());
app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(morgan("dev"));

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", productRoute);
app.use("/api/v1", postRoute);

app.listen(process.env.PORT || 4004, () => {
  console.log(`sever running on ${process.env.PORT}`);
});
