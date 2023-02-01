const express = require("express");

const router = express.Router();
const userController = require("../controllers/user");

// GET
router.get("/", userController.getAllUser);
router.get("/:roomId", userController.getId_userByRoomId);

module.exports = router;
