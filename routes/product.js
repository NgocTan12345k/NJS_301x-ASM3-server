const express = require("express");
const router = express.Router();
const multer = require("multer");
// upload file images
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    // console.log("file-->", file);
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

// console.log("fileStorage-->", fileStorage);

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// console.log("fileFilter-->", fileFilter);

// const uploads = multer({
//   // dest: "image",
//   storage: fileStorage,
//   fileFilter: fileFilter,
// }).fields([{ name: "image", maxCount: 4 }]);
const uploads = multer({
  // dest: "image",
  storage: fileStorage,
  fileFilter: fileFilter,
});
// console.log("uploads--.", uploads);

const productController = require("../controllers/product");

// GET
router.get("/getAllProducts", productController.getAllProducts);
router.get("/:id", productController.getProductDetail);

// POST
router.post(
  "/postAddProduct",
  uploads.array("images", 4),
  productController.postAddProduct
);

// DELETE
router.delete("/delete/:id", productController.deteleProduct);

// UPDATE
router.put("/update/:id", productController.updateProduct);

module.exports = router;
