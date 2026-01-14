const express = require("express");


const { Product } = require("../model/Product");
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require("../controller/Product");

const router = express.Router();
//  /products is already added in base path
router
  .post("/", createProduct)
  .get("/", fetchAllProducts)
  .get("/:id", fetchProductById)
  .patch("/:id", updateProduct);


exports.router = router;
