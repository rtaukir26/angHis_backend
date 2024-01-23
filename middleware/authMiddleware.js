const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");

exports.requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    ); /**getting user Id */
    req.user = decode;
    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      error,
      message: "Invalid access token",
    });
  }
};

//Admin access
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res
        .status(401)
        .send({ success: false, message: "UnAuthorized Access" });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error: error.message,
      message: "Error in admin middleware",
    });
  }
};