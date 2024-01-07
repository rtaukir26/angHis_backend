const express = require("express");
const formidable = require("express-formidable");
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const {
  createProduct,
  getAllProduct,
  singleProduct,
  singleProductPhoto,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

//Routes
router.post(
  "/new-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProduct
);

router.get("/products", requireSignIn, getAllProduct);
router.get("/product/:id", requireSignIn, singleProduct);
//photo
router.get("/product-photo/:id", requireSignIn, singleProductPhoto);
router.get("/product-delete/:id", requireSignIn, deleteProduct);
router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProduct
);

module.exports = router;
