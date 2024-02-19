const { body, param } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware")
exports.sendMessageValidator = [
    param('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid User ID'),
    body('content')
    .notEmpty()
    .withMessage('Content is required'),
    validatorMiddleware
]