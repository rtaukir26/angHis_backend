const multer = require("multer");

const moment = require("moment");


const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });

// Multer storage configuration

const storage = multer.diskStorage({
  destination: process.env.SERVER_FILE_PATH_PROFILE_IMG,

  filename: (req, file, cb) => {
    const originalFileName = file.originalname;

    console.log(file, "filesd");

    const fileExtensionWithName = originalFileName.split(".");

    const currentDate = moment().format("YYYY-MM-DD_HH-mm-ss");

    const filename = `${fileExtensionWithName[0]}_${currentDate}.${fileExtensionWithName[1]}`;

    cb(null, filename);
  },
});

// Multer upload instance

const upload = multer({ storage, limits: { fileSize: 4000000 } }).single(
  "file"
); // Assuming the file field name is 'file'

module.exports = upload;
