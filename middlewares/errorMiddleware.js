const globalError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "Error";
    process.env.NODE_ENV = "development" ?
        res
        .status(statusCode)
        .json({ status, message: err.message, isOperational: err.isOperational, stack: err.stack }) :
        res.status(statusCode).json({ status, message: err.message });
};
module.exports = globalError