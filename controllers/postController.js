const PostModel = require("../models/PostModel");
const fs = require("fs");
const mongoose = require("mongoose");

//Post/Create post
exports.dataPost = async (req, res) => {
  try {
    const { user, inputTextarea } =
      req.fields; /**getting from formidable module */
    const { photo } = req.files;

    //validation
    switch (true) {
      // case !user:
      //   return res
      //     .status(500)
      //     .send({ success: false, message: "please login" });
      case !photo && photo.size > 10000:
        return res.status(500).send({
          success: false,
          message: "Photo is required and less than 1mb",
        });
    }

    // const product = await new productModel({ ...req.fields },{new:true});
    const post = await new PostModel({ ...req.fields });
    if (photo) {
      post.photo.data = fs.readFileSync(photo.path);
      post.photo.contentType = photo.type;
    }
    if (inputTextarea) {
      post.postMessage = inputTextarea;
    }
    await post.save();
    res.status(201).send({
      success: true,
      message: "Data has posted successfully",
      post,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in post",
      error,
    });
  }
};

//Get All post
exports.getAllPostedData = async (req, res) => {
  try {
    const posts = await PostModel.find({})
      // .select("-photo")
      // .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "All posts retrived successfully",
      posts,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error in get all posts" });
  }
};

//Update post, Note:Not using for now
exports.updatePost = async (req, res) => {
  try {
    const { photo } = req.files;
    const post = await PostModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        ...req.fields,
      },
      { new: true }
    );
    // .populate("users"); //not populating for now
    if (photo) {
      post.photo.data = fs.readFileSync(photo.path);
      post.photo.contentType = photo.type;
    }

    await post.save();
    console.log("post", post);
    res.status(200).send({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in update product",
      error,
    });
  }
};

//Get single post/image
exports.getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    console.log("User ID in Post:", post.user);

    // Populate the user field
    await post.populate("user");
    await post.save();
    console.log("Post after populate:", post);

    res.status(200).json({
      success: true,
      message: "Message has been retrieved successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error in get single post:", error);
    res.status(500).json({
      success: false,
      message: "Error in get single post",
      error: error.message,
    });
  }
};

//Get Like post/image
exports.getLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image ID",
      });
    }

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    //check is user already liked, dislike, heart or not
    let isUserLiked = await post.likes.usersLiked.includes(userId);

    let isUserDisliked = await post.disLikes.usersDisliked.includes(userId);
    let isUserGiveHearts = await post.hearts.usersHearts.includes(userId);

    if (isUserLiked) {
      res.status(400).json({
        success: false,
        message: "You are already likes this post",
      });
    } else if (isUserDisliked) {
      post.disLikes.usersDisliked.pop(userId);
      post.disLikes.totalDislikes -= 1;

      post.likes.usersLiked.push(userId);
      post.likes.totalLikes += 1;

      await post.save();
      res.status(200).json({
        success: true,
        message: "Message has been retrieved successfully",
        data: post,
      });
    } else if (isUserGiveHearts) {
      post.hearts.usersHearts.pop(userId);
      post.hearts.totalHearts -= 1;

      post.likes.usersLiked.push(userId);
      post.likes.totalLikes += 1;

      await post.save();
      res.status(200).json({
        success: true,
        message: "Message has been retrieved successfully",
        data: post,
      });
    } else {
      post.likes.usersLiked.push(userId);
      post.likes.totalLikes += 1;

      // Populate the user field
      // await post.populate("user");
      await post.save();
      res.status(200).json({
        success: true,
        message: "Message has been retrieved successfully",
        data: post,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in like post",
      error: error.message,
    });
  }
};

//Get Dislike post/image
exports.getDislikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image ID",
      });
    }

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    //check is user already liked, dislike, heart or not
    let isUserLiked = await post.likes.usersLiked.includes(userId);

    let isUserDisliked = await post.disLikes.usersDisliked.includes(userId);
    let isUserGiveHearts = await post.hearts.usersHearts.includes(userId);

    if (isUserDisliked) {
      res.status(400).json({
        success: false,
        message: "You are already dislikes this post",
      });
    } else if (isUserLiked) {
      post.likes.usersLiked.pop(userId);
      post.likes.totalLikes -= 1;

      post.disLikes.usersDisliked.push(userId);
      post.disLikes.totalDislikes += 1;

      await post.save();
      res.status(200).json({
        success: true,
        message: "Message has been retrieved successfully",
        data: post,
      });
    } else if (isUserGiveHearts) {
      post.hearts.usersHearts.pop(userId);
      post.hearts.totalHearts -= 1;

      post.disLikes.usersDisliked.push(userId);
      post.disLikes.totalDislikes += 1;

      await post.save();
      res.status(200).json({
        success: true,
        message: "Message has been retrieved successfully",
        data: post,
      });
    } else {
      post.disLikes.usersDisliked.push(userId);
      post.disLikes.totalDislikes += 1;

      await post.save();
      res.status(200).json({
        success: true,
        message: "Message has been retrieved successfully",
        data: post,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Dislike post",
      error: error.message,
    });
  }
};

//Give heart post/image
exports.getHeartPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image ID",
      });
    }

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    //check is user already liked, dislike, heart or not
    let isUserGiveHearts = await post.hearts.usersHearts.includes(userId);
    let isUserLiked = await post.likes.usersLiked.includes(userId);

    let isUserDisliked = await post.disLikes.usersDisliked.includes(userId);

    if (isUserGiveHearts) {
      res.status(400).json({
        success: false,
        message: "You are already given heart to this post",
      });
    } else if (isUserLiked) {
      post.likes.usersLiked.pop(userId);
      post.likes.totalLikes -= 1;

      post.hearts.usersHearts.push(userId);
      post.hearts.totalHearts += 1;

      await post.save();
      res.status(200).json({
        success: true,
        message: "Message has been retrieved successfully",
        data: post,
      });
    } else if (isUserDisliked) {
      post.disLikes.usersDisliked.pop(userId);
      post.disLikes.totalDislikes -= 1;

      post.hearts.usersHearts.push(userId);
      post.hearts.totalHearts += 1;

      await post.save();
      res.status(200).json({
        success: true,
        message: "Message has been retrieved successfully",
        data: post,
      });
    } else {
      post.hearts.usersHearts.push(userId);
      post.hearts.totalHearts += 1;

      await post.save();
      res.status(200).json({
        success: true,
        message: "Message has been retrieved successfully",
        data: post,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in Heart post",
      error: error.message,
    });
  }
};

//Write comments - Post method
exports.writeCommets = async (req, res) => {
  try {
    const imgId = req.params.id;
    const { comments } = req.body;

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(imgId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image ID",
      });
    }

    const post = await PostModel.findById(imgId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    await post.comments.push(comments);

    await post.save();
    res.status(200).json({
      success: true,
      message: "Data has been retrieved successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in comment post",
      error: error.message,
    });
  }
};
