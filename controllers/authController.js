const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const JWT = require("jsonwebtoken");

//Register user - POST
exports.register = async (req, res) => {
  try {
    const { name, email, password, answer, role } = req.body;
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }
    //check user
    const existingUser = await userModel.findOne({ email });
    //check existing user
    if (existingUser) {
      return res.status(200).send({
        succes: true,
        message: "Already register. please login",
      });
    }
    //Register user
    const hashPwd = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      password: hashPwd,
      answer,
      role,
    }).save(); /*dont pass req.body becouse pws is hashed */

    res
      .status(201)
      .send({ success: true, message: "User register successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      succes: false,
      message: "Error in Registration",
      error,
    });
  }
};

//Login user - POST
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(404)
        .send({ success: false, error: "Invalid email or password" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Email is not registered" });
    }
    const match = await comparePassword(
      password,
      user.password
    ); /**true/false */
    if (!match) {
      return res
        .status(200)
        .send({ success: false, message: "Invalid password" });
    }
    //Token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
      // expiresIn: "60",
    });
    res.status(200).send({
      success: true,
      message: "Logged in successfully",
      user: { name: user.name, email: user.email, id: user._id },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

//forget password
exports.forgetPassword = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      res.status(400).send({ success: false, message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ success: false, message: "Answer is required" });
    }
    if (!newPassword) {
      res
        .status(400)
        .send({ success: false, message: "newPassword is required" });
    }
    //check
    const user = await userModel.findOne({ email });
    if (!user) {
      res
        .status(400)
        .send({ success: false, message: "Wrong Email or Answer" });
    }
    const hashPwd = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashPwd });
    res
      .status(200)
      .send({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Something went wrong", error });
  }
};

//test -- get
exports.testController = async (req, res) => {
  console.log("protected route");
  res.send("protected route");
};
