import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    product: {
      images: [],
    },
    reviews: [],
    isReviewSubmitted: false,
    isProductCreated: false,
    isProductDeleted: false,
    isProductUpdated: false,
    isReviewDeleted: false,
  },
  reducers: {
    productRequest(state) {
      state.loading = true;
    },
    productSuccess(state, action) {
      state.loading = false;
      state.product = action.payload.product;
    },
    productFail(state, action) {
      ((state.loading = false), (state.error = action.payload));
    },
    createReviewRequest(state) {
      state.loading = true;
    },
    createReviewSuccess(state) {
      state.loading = false;
      state.isReviewSubmitted = true;
    },
    createReviewFail(state, action) {
      ((state.loading = false),
        (state.isReviewSubmitted = false),
        (state.error = action.payload));
    },
    clearIsReviewSubmitted(state) {
      state.loading = false;
      state.isReviewSubmitted = false;
    },
    clearError(state) {
      ((state.loading = false), (state.error = null));
    },
    clearProduct(state) {
      ((state.loading = false), (state.product = {}));
    },
    createNewProductRequest(state) {
      state.loading = true;
      state.isProductCreated = false;
    },
    createNewProductSuccess(state, action) {
      state.loading = false;
      state.product = action.payload.product;
      state.isProductCreated = true;
    },
    createNewProductFail(state, action) {
      ((state.loading = false),
        (state.isProductCreated = false),
        (state.error = action.payload));
    },
    clearProductCreated(state) {
      ((state.loading = false), (state.isProductCreated = false));
    },
    deleteProductRequest(state) {
      state.loading = true;
      state.isProductDeleted = false;
    },
    deleteProductSuccess(state, action) {
      state.loading = false;

      state.isProductDeleted = true;
    },
    deleteProductFail(state, action) {
      ((state.loading = false),
        (state.isProductDeleted = false),
        (state.error = action.payload));
    },
    clearProductDeleted(state) {
      ((state.loading = false), (state.isProductDeleted = false));
    },
    updateProductRequest(state) {
      state.loading = true;
    },
    updateProductSuccess(state, action) {
      state.loading = false;
      state.isProductUpdated = true;
    },
    updateProductFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    clearProductUpdated(state) {
      ((state.loading = false), (state.isProductUpdated = false));
    },
    getReviewsRequest(state) {
      state.loading = true;
    },
    getReviewsSuccess(state, action) {
      state.loading = false;
      state.reviews = action.payload.reviews;
    },
    getReviewsFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteReviewRequest(state) {
      state.loading = true;
    },
    deleteReviewSuccess(state, action) {
      state.loading = false;
      state.isReviewDeleted = true;
    },
    deleteReviewFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearReviewDeleted(state) {
      ((state.loading = false), (state.isReviewDeleted = false));
    },
    clearReviews(state) {
      state.loading = false;
      state.reviews = null;
    },
  },
});

export const { actions, reducer } = productSlice;
export const {
  productRequest,
  productSuccess,
  productFail,
  createReviewFail,
  createReviewRequest,
  createReviewSuccess,
  clearIsReviewSubmitted,
  clearError,
  clearProduct,
  createNewProductRequest,
  createNewProductSuccess,
  createNewProductFail,
  clearProductCreated,
  deleteProductFail,
  deleteProductRequest,
  deleteProductSuccess,
  clearProductDeleted,
  updateProductFail,
  updateProductRequest,
  updateProductSuccess,
  clearProductUpdated,
  getReviewsFail,
  getReviewsRequest,
  getReviewsSuccess,
  deleteReviewFail,
  deleteReviewRequest,
  deleteReviewSuccess,
  clearReviewDeleted,
  clearReviews,
} = actions;

export default reducer;
