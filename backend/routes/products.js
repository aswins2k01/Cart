const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "..", "/uploads/product"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

const {
  getProducts,
  newProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productContoller");
const {
  isAuthenticatedUser,
  authoriseRoles,
} = require("../middlewares/authenticate");

router.route("/products").get(getProducts);

router
  .route("/product/:id")
  .get(getSingleProduct)
  .put(isAuthenticatedUser, authoriseRoles("admin"), updateProduct);

router.route("/review").put(isAuthenticatedUser, createReview);

//Admin routes
router
  .route("/admin/product/new")
  .post(
    isAuthenticatedUser,
    authoriseRoles("admin"),
    upload.array("images"),
    newProducts,
  );
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authoriseRoles("admin"), getAdminProducts);
router
  .route("/admin/product/:id")
  .delete(isAuthenticatedUser, authoriseRoles("admin"), deleteProduct)
  .put(
    isAuthenticatedUser,
    authoriseRoles("admin"),
    upload.array("images"),
    updateProduct,
  );

router
  .route("/admin/reviews")
  .get(isAuthenticatedUser, authoriseRoles("admin"), getReviews);
router
  .route("/admin/review")
  .delete(isAuthenticatedUser, authoriseRoles("admin"), deleteReview);
module.exports = router;
