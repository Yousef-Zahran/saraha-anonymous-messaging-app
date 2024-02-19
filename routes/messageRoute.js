const express = require("express");
const Router = express();
const messageController = require("../controllers/messageController");
const verifyToken = require("../utils/verifyToken");
const { sendMessageValidator } = require("../utils/validators/msgValidator");
Router.post(
        "/sendMessage/:id",
        verifyToken,
        sendMessageValidator,
        messageController.sendMessage
    ),
    Router.get("/userMessages", verifyToken, messageController.userMessages),
    module.exports = Router;