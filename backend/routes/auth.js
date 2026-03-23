const express = require("express");
const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "/uploads/user"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getProfile,
  changePasssword,
  update,
  getUsers,
  getSpecificUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const {
  isAuthenticatedUser,
  authoriseRoles,
} = require("../middlewares/authenticate");

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/myProfile").get(isAuthenticatedUser, getProfile);
router
  .route("/myProfile/password/change")
  .put(isAuthenticatedUser, changePasssword);
router
  .route("/myProfile/update")
  .put(isAuthenticatedUser, upload.single("avatar"), update);

//Admin Routes

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authoriseRoles("admin"), getUsers);
router
  .route("/admin/users/:id")
  .get(isAuthenticatedUser, authoriseRoles("admin"), getSpecificUser)
  .put(isAuthenticatedUser, authoriseRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authoriseRoles("admin"), deleteUser);

module.exports = router;
