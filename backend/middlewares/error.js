const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV == "development") {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  if (process.env.NODE_ENV == "production") {
    let message = err.message;
    // let error = { ...err }; message property are non-enumerable(hidden)- cant copy
    let error = new ErrorHandler(message);

    if (err.name == "ValidationError") {
      message = Object.values(err.errors).map((values) => values.message); // why cant direct log this messager0
      error = new ErrorHandler(message);
      err.statusCode = 400;
    }

    if (err.name == "CastError") {
      message = `Resource not found: ${err.path}`;
      error = new ErrorHandler(message);
      err.statusCode = 400;
    }
    if (err.name == "JSONWebTokenError") {
      let message = `JSON web token is invalid . Try again`;
      error = new ErrorHandler(message);
      err.statusCode = 400;
    }
    if (err.code == 11000) {
      let message = `Duplicate ${Object.keys(err.keyValue)} email`;
      error = new ErrorHandler(message);
      err.statusCode = 400;
    }
    if (err.code == "TokenExpiredError") {
      let message = `JSON web token is expired . Try again`;
      error = new ErrorHandler(message);
      err.statusCode = 400;
    }

    res.status(err.statusCode).json({
      success: false,
      error: error.message || "Internal Server error",
    });
  }
};
