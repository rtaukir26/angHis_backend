const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    postMessage: { type: String, trim: true },
    photo: { data: Buffer, contentType: String },
    likes: {
      usersLiked: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
      ],
      totalLikes: { type: Number, default: 0 },
    },
    disLikes: {
      usersDisliked: [
        {
          type: String,
        },
      ],
      totalDislikes: { type: Number, default: 0 },
    },
    hearts: {
      usersHearts: [
        {
          type: String,
        },
      ],
      totalHearts: { type: Number, default: 0 },
    },
    comments: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("posts", postSchema);
