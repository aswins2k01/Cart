const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter the name "],
  },
  email: {
    type: String,
    required: [true, "please enter the email id"],
    validator: [validator.isEmail, "please enter the valid email id"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, " please enter the password"],
    maxlength: [6, "password cannot exceed 6 characters"],
    select: false,
  },
  avatar: {
    type: String,
  },
  passwordResetToken: String,
  passwordResetTokenExpire: Date,
  role: {
    type: String,
    default: " user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.getJwt = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

userSchema.methods.validPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetToken = function () {
  //creating token
  const token = crypto.randomBytes(20).toString("hex");
  //hasing and set to resetpasswordtoken field in the document
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.passwordResetTokenExpire = Date.now() + 30 * 60 * 1000;
  return token;
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
