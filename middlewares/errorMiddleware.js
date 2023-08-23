require('dotenv').config();

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode).json({
        ok: false,
        msg: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack.replace(/(\r\n|\n|\r)/gm, ':::').split(':::') : null // replace any form of line break to make an array for better readability from stack
    });
};

module.exports = {
    errorHandler
}