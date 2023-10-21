const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const bodyParser = require("body-parser");

module.exports = app; //exports to server.js

//Routes import
const PostRoute = require("./routes/postRoute");


app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use("/api/v1", PostRoute);