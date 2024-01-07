const express = require("express");
const formidable = require("express-formidable");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");
const {
  dataPost,
  getAllPostedData,
  updatePost,
  getSinglePost,
  getLikePost,
  getDislikePost,
  getHeartPost,
  writeCommets,
} = require("../controllers/postController");

const router = express.Router();

//Routes

//Create post
router.post("/post", formidable(), dataPost);

//Get all post
router.get("/get-posts", requireSignIn, getAllPostedData);

//Update post
router.put("/update-post/:id", requireSignIn, formidable(), updatePost);

//Get single post
router.get("/single-post/:id", requireSignIn, formidable(), getSinglePost);

//Like post
router.get("/like-post/:id", requireSignIn, getLikePost);

//Dislike post
router.get("/dislike-post/:id", requireSignIn, getDislikePost);

//Give Hearts like post
router.get("/heart-post/:id", requireSignIn, getHeartPost);

//Write comment post
router.post("/comment/:id", requireSignIn, writeCommets);

module.exports = router;
