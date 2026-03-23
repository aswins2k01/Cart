const { isAscii } = require("validator");
const catchAsyncError = require("../middlewares/catchAsyncError");
const orderModel = require("../models/orderModel");
const ErrorHandler = require("../utils/errorHandler");
const productModel = require("../models/productmodel");

//create Order = /api/v1/order/new
exports.createOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;
  const order = await orderModel.create({
    orderItems,
    shippingInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id,
  });
  res.status(200).json({
    success: true,
    order,
  });
});

//Get Single Order = /api/v1/order/:id

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate("user", "name email");
  if (!order) {
    return next(
      new ErrorHandler(`Order not found with this order id: ${req.params.id}`),
    );
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged in users order: /api/v1/myOrders

exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    orders,
  });
});

// Admin : Get all orders : /api/v1/allOrders

exports.allOrders = catchAsyncError(async (req, res, next) => {
  const orders = await orderModel.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Admin : update orders/ update order status: /api/v1/order/:id

exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (order.orderStatus == "Delivered") {
    return next(new ErrorHandler("Order has already been dleivered", 400));
  }

  // updating the stocks in the products collection
  order.orderItems.forEach(async (orderItem) => {
    await updateStock(orderItem.product, orderItem.quantity);
  });

  // updating the order status

  if (req.body.orderStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }
  order.orderStatus = req.body.orderStatus;

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(productId, quantity) {
  const product = await productModel.findById(productId);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}
//Admin : Delete order

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(
      new ErrorHandler(`Order not found with this order id: ${req.params.id}`),
    );
  }
  await order.deleteOne();
  res.status(200).json({
    success: true,
  });
});
