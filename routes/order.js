const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const authController = require("../controllers/auth");
const isAuth = authController.isAuth;
// POST

router.post("/postOrder", isAuth, orderController.postOrder);

// GET
router.get("/getOrder", isAuth, orderController.getOrder);
router.get("/getOrderDetail/:id", isAuth, orderController.getOrderDetail);
router.get("/getAllOrders", isAuth, orderController.getAllOrders);

module.exports = router;
