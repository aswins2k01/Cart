const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const userModel = require("../models/usermodel");
const catchAsyncError = require("./catchAsyncError");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Login first to access the resource", 401));
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await userModel.findById(decode.id);
  next();
});

exports.authoriseRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to do the operation`,
        ),
      );
    }
    next();
  };
};
