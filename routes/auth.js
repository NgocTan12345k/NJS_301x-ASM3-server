const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

// POST
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// GET
router.get("/deleteSession", authController.deleteSession);

module.exports = router;
