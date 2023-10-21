const express = require("express");

const { createPost } = require("../controllers/post_controller");
const router = express.Router();
router.route("/post").post(createPost);


module.exports = router; //exporting to app