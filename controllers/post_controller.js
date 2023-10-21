const Post = require("../models/post_module");
const upload = require("../middleware/fileUpload/fileUpload");
//create post
exports.createPost = async (req, res, next) => {
  upload(req, res, async (error) => {
    if (error) {
      console.error("File upload failed:", error);
      return res

        .status(400)

        .json({ statusCode: 400, message: "File upload failed" });
    }

    const file = req.file;
    console.log("file",file)
    req.body.images=[
      {
        public_id:'1',
        url:file.path

      }
    ]
    const post = await Post.create(req.body); //we can get productSchema validation error
    console.log("error");
    if (file && post) {
      res.status(201).json({
        success: true,
        message: "uploaded successfully",
        post,
      });
    }
  });
};
