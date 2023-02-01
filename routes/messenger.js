const express = require("express");
const router = express.Router();

const messengerController = require("../controllers/messenger");

// GET
router.get("/getAllMessenger", messengerController.getAllMesenger);
router.get("/", messengerController.getMessengerDetail);

// POST
router.post("/send", messengerController.send);
router.post("/conversation", messengerController.conversation);

// DELETE
router.delete("/deleteMessenger/:roomId", messengerController.deleteMessenger);

module.exports = router;
