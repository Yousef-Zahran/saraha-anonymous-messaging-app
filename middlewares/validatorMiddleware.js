const { validationResult } = require('express-validator')
const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // console.log('validation');
        return res.status(400).json({ error: errors.array() });
    }
    next();
}
module.exports = validator;