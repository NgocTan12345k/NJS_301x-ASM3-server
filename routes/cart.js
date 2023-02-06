const express = require("express");

const router = express.Router();
const cartController = require("../controllers/cart");
const authController = require("../controllers/auth");
const isAuth = authController.isAuth;

// POST

router.post("/add", isAuth, cartController.postAddToCart);

// GET
router.get("/", isAuth, cartController.getCart);

// DELETE
router.delete("/delete", isAuth, cartController.deleteCart);

// UPDATE
router.put("/update", isAuth, cartController.updateCart);

module.exports = router;
