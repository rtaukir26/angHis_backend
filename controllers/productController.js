const productModel = require("../models/productModel");
const fs = require("fs");

//Create product -- Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock, shipping } =
      req.fields; /**getting from formidable module */
    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        return res
          .status(500)
          .send({ success: false, message: "Name is required" });
      case !category:
        return res
          .status(500)
          .send({ success: false, message: "Category is required" });
      case !description:
        return res
          .status(500)
          .send({ success: false, message: "Description is required" });
      case !price:
        return res
          .status(500)
          .send({ success: false, message: "Price is required" });
      case !photo && photo.size > 10000:
        return res.status(500).send({
          success: false,
          message: "Photo is required and less than 1mb",
        });
    }

    // const product = await new productModel({ ...req.fields },{new:true});
    const product = await new productModel({ ...req.fields });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

//Get All product
exports.getAllProduct = async (req, res) => {
  try {
    // const products = await productModel.find();
    // const products = await productModel.find({}).populate("category").select("-photo").limit(12).sort({createdAt:-1});
    const products = await productModel
      .find({})
      // .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "All product retrived successfully",
      products,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error in get product" });
  }
};

//Get single product
exports.singleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      res.status(404).send({ success: false, message: "Invalid product Id" });
    }
    res.status(200).send({
      success: true,
      message: "Product retrived successfully",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in single product" });
  }
};

//Get single product photo
exports.singleProductPhoto = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).select("photo");
    if (!product) {
      res.status(404).send({ success: false, message: "Invalid product Id" });
    }
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send({
        success: true,
        message: "Product photo retrived successfully",
        photo: product.photo.data,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in single product photo" });
  }
};

//Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    // const product = await productModel
    //   .findByIdAndDelete(req.params.id)
    //   .select("-photo");
    if (!product) {
      res.status(404).send({ success: false, message: "Invalid product Id" });
    }
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in delete product" });
  }
};

//Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock, shipping } =
      req.fields; /**getting from formidable module */
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res
          .status(500)
          .send({ success: false, message: "Name is required" });
      case !category:
        return res
          .status(500)
          .send({ success: false, message: "Category is required" });
      case !description:
        return res
          .status(500)
          .send({ success: false, message: "Description is required" });
      case !price:
        return res
          .status(500)
          .send({ success: false, message: "Price is required" });
      case !photo && photo.size > 10000:
        return res.status(500).send({
          success: false,
          message: "Photo is required and less than 1mb",
        });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields,
      },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in update product",
      error,
    });
  }
};
