const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    // category: { type: mongoose.ObjectId, ref: "Category", required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 1 },
    photo: { data: Buffer, contentType: String },
    // photo: { url: { type: String, required: true } },
    shipping: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", productSchema);
