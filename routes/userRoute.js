const express = require("express");
const Router = express();
const userController = require("../controllers/userController");
const verifyToken = require("../utils/verifyToken");
const {
    signUpValidator,
    signInValidator,
    updateValidator,
} = require("../utils/validators/userValidator");

Router.post("/signUp", signUpValidator, userController.signUp),
    Router.post("/signIn", signInValidator, userController.signIn),
    Router.get("/auth/:token", userController.confirmEmail),
    Router.put(
        "/",
        verifyToken,
        userController.uploadMultipleImages,
        updateValidator,
        userController.updateUser
    ),
    Router.delete("/deleteMyAccount", verifyToken, userController.deleteUser),
    module.exports = Router;