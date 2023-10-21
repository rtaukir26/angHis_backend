const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  postMessage: { type: String, trim: true },

  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  likes: { type: Number, default: 0 },
  disLikes: { type: Number, default: 0 },
  comments: [{ type: String, trim: true }],
});

module.exports = mongoose.model("posts", postSchema); //exports to userController.js
