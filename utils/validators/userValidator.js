const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware")
exports.signUpValidator = [
    check("name")
    .notEmpty()
    .withMessage("the name of the user is required")
    .isLength({ min: 3 })
    .withMessage("the name of the user must be at least 3 characters")
    .isLength({ max: 20 })
    .withMessage("the name of the user is too long"),
    check("email")
    .notEmpty()
    .withMessage("the email of the user is required")
    .isEmail()
    .withMessage("the email address of the user is not valid"),
    check("password")
    .notEmpty()
    .withMessage("the password of the user is required")
    .isLength({ min: 6 })
    .withMessage("the password is too short")
    .isLength({ max: 25 })
    .withMessage("the password is too long"),
    validatorMiddleware,
];

exports.signInValidator = [
    check("email")
    .notEmpty()
    .withMessage("Please enter your email address")
    .isEmail()
    .withMessage("Your email address is not valid"),
    check("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 6 })
    .withMessage("wrong password!"),
    validatorMiddleware,
];


exports.updateValidator = [
    check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("The name must be at least 3 characters")
    .isLength({ max: 20 })
    .withMessage("The name is too long"),
    check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .isLength({ max: 25 })
    .withMessage("Password is too long"),
    validatorMiddleware,
];