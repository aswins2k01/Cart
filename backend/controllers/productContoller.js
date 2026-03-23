const catchAsyncError = require("../middlewares/catchAsyncError");
const productModel = require("../models/productmodel");
const ProductModel = require("../models/productmodel");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");

//  handler functions to handle products
// /api/v1/products?keyword=(oppo)&category=(Mobile Phones)
exports.getProducts = catchAsyncError(async (req, res, next) => {
  const resPerPage = 3;

  const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
    .search()
    .filter();

  const productsCount = await apiFeatures.query.clone().countDocuments({});

  // const countWithSearch = await ApiFeatures().countDocuments({});
  // let productsCount = totalItemsCount;
  // if (countWithSearch !== totalItemsCount) {
  //   productsCount = countWithSearch;
  // }
  const products = await apiFeatures.paginate(resPerPage).query;

  res.status(200).json({
    success: true,
    count: productsCount,
    products,
    resPerPage,
  });
});
//for creating the  new products - /api/v1/products
exports.newProducts = catchAsyncError(async (req, res, next) => {
  let images = [];

  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (req.files.length > 0) {
    req.files.forEach((file) => {
      let url = `${BASE_URL}/uploads/product/${file.originalname}`;
      images.push({ image: url });
    });
  }

  req.body.images = images;
  req.body.user = req.user.id;
  const product = await ProductModel.create(req.body);
  res.status(201).json({
    success: true,

    product,
  });
});
// get single product-/api/v1/product/:id'
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id).populate(
    "reviews.user",
    "name email",
  );

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// update product - /api/v1/product/:id

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await ProductModel.findById(req.params.id);

  let images = [];

  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (
    req.body.isImagesCleared === "false"
    // ||
    // (req.body.images && req.body.images.length > 0)
  ) {
    images = [...product.images];
  }

  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      let url = `${BASE_URL}/uploads/product/${file.originalname}`;
      images.push({ image: url });
    });
  }

  if (images.length === 0) {
    return next(
      new ErrorHandler("Atleast one image is required for the Product", 400),
    );
  }

  req.body.images = images;
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
  product = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// delete product-/api/v1/product/:id

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const Product = await ProductModel.findById(req.params.id);

  if (!Product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
  await Product.deleteOne();
  res.status(200).json({
    success: true,
    message: "product deleted!",
  });
});

// Create , update reviews and ratings /api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { productId, ratings, comment } = req.body;
  const review = {
    user: req.user.id,
    comment,
    ratings,
  };
  // checking whether the product has a review
  const product = await productModel.findById(productId);
  const isReviewed = product.reviews.find((review) => {
    return review.user.toString() == req.user.id.toString();
  });

  // updating the review
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() == req.user.id.toString()) {
        review.comment = comment;
        review.ratings = ratings;
      }
    });

    // creating the review
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // finding the average of the ratings
  product.ratings =
    product.reviews.reduce((acc, review) => {
      return review.ratings + acc;
    }, 0) / product.reviews.length;
  product.ratings = isNaN(product.ratings) ? 0 : product.ratings;
  await product.save();
  res.status(201).json({
    success: true,
  });
});

//Get reviews - /api/v1/reviews
exports.getReviews = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.query.productId);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete reviews - /api/v1/review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await productModel.findById(req.query.productId);

  // filltering the reviews
  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.reviewId.toString();
  });

  // reassigning the numOfReviews
  const numOfReviews = reviews.length;

  // finding the average of ratings
  let ratings =
    reviews.reduce((acc, review) => {
      return review.ratings + acc;
    }, 0) / reviews.length;
  ratings = isNaN(ratings) ? 0 : ratings;

  // updating the product
  await productModel.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews,
  });
  res.status(200).json({
    success: true,
  });
});

exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await ProductModel.find();
  res.status(200).json({
    success: true,
    products,
  });
});
