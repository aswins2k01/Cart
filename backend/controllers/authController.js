const catchAsyncError = require("../middlewares/catchAsyncError");
const sendEmail = require("../middlewares/sendEmail");
const userModel = require("../models/usermodel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const crypto = require("crypto");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  let avatar;

  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (req.file) {
    avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
  }

  const user = await userModel.create({
    name,
    email,
    password,
    avatar,
  });
  // const token = user.getJwtToken()
  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const checkedPassword = await user.validPassword(password);
  if (!checkedPassword) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 201, res);
});

exports.logoutUser = (req, res, next) => {
  res
    .cookie("token", null, {
      options: {
        expires: new Date(Date.now()),
        httpOnly: true,
      },
    })
    .status(200)
    .json({
      success: true,
      message: "logged out successfully",
    });
};

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  let BASE_URL = process.env.FRONTEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (!user) {
    return next(new ErrorHandler("user not found ", 404));
  }

  const token = user.getResetToken();
  await user.save({ validateBeforeSave: false });
  const link = `${BASE_URL}/password/reset/${token}`;
  const message = `your requested password reset link is as follows\n\n
            if not requested please ignore this\n\n ${link}`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: "cart password reset email",
      text: message,
    });
    res.status(200).json({
      success: true,
      message: `email sent to the user email: ${user.email}`,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await userModel.findOne({
    passwordResetToken,
    passwordResetTokenExpire: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    return next(new ErrorHandler("password reset token invalid or expired"));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("password & confirm password did not match"));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });
  user.password = undefined;

  sendToken(user, 200, res); // no res here because sendToken is doing that
});

exports.getProfile = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.changePasssword = catchAsyncError(async (req, res, next) => {
  const oldPassword = req.body.oldPassword;
  const user = await userModel.findById(req.user.id).select("+password");
  if (!(await user.validPassword(oldPassword))) {
    return next(new ErrorHandler("password does not match", 401));
  }
  user.password = req.body.password;
  res.status(201).json({
    success: true,
    message: "password changed successfully",
  });
});

exports.update = catchAsyncError(async (req, res, next) => {
  let updates = {
    name: req.body.name,
    email: req.body.email,
  };
  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  let avatar;
  if (req.file) {
    ((avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`),
      (updates = {
        ...updates,
        avatar,
      }));
  }
  const user = await userModel.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    success: true,
    message: "Changes updated successfully",
    user,
  });
});

//Admin: Get users
exports.getUsers = catchAsyncError(async (req, res, next) => {
  const users = await userModel.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// Admin:Get Specific Users
exports.getSpecificUser = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//Admin: Update User
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const updateProperties = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await userModel.findByIdAndUpdate(
    req.params.id,
    updateProperties,
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    success: true,
    message: "user updated successfully",
  });
});

//Admin : delete user
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`user not found with this id: ${req.params.id}`),
    );
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: " user deleted",
  });
});
