const express = require("express");
const {
  createOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();
const {
  isAuthenticatedUser,
  authoriseRoles,
} = require("../middlewares/authenticate");

router.route("/order/new").post(isAuthenticatedUser, createOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/myOrders").get(isAuthenticatedUser, myOrders);

//admin route

router
  .route("/admin/allOrders")
  .get(isAuthenticatedUser, authoriseRoles("admin"), allOrders);
module.exports = router;
//update order status
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authoriseRoles("admin"), updateOrder);
router
  .route("/admin/order/:id")
  .delete(isAuthenticatedUser, authoriseRoles("admin"), deleteOrder);
