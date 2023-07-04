const express = require("express");
const router = express.Router();
const { createProduct, getBills, updateProducts, getproducts } = require("./controller/productController");

router.post("/admin/additem", createProduct)
router.put("/admin/update", updateProducts)

router.get("/products", getproducts)
router.get("/:customerName/bill", getBills)

module.exports = router;