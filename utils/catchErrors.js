const catchError = (controller) => {
    return (req, res, next) => {
        controller(req, res, next).catch((err) => {
            res.status(500).json({ success: false, message: err.message, stack: err.stack });
        })
    }
}
module.exports = catchError;