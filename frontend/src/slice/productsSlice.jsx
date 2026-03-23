import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
    products: [],
  },
  reducers: {
    productsRequest(state) {
      state.loading = true;
    },
    productsSuccess(state, action) {
      ((state.loading = false),
        (state.products = action.payload.products),
        (state.totalItemsCount = action.payload.count),
        (state.resPerPage = action.payload.resPerPage));
    },
    productsFail(state, action) {
      ((state.loading = false), (state.error = action.payload));
    },
    adminProductsRequest(state) {
      state.loading = true;
    },
    adminProductsSuccess(state, action) {
      ((state.loading = false), (state.products = action.payload.products));
    },
    adminProductsFail(state, action) {
      ((state.loading = false), (state.error = action.payload));
    },
    clearError(state, action) {
      ((state.loading = false), (state.error = null));
    },
  },
});

const { actions, reducer } = productsSlice;

export const {
  productsRequest,
  productsSuccess,
  productsFail,
  adminProductsRequest,
  adminProductsSuccess,
  adminProductsFail,
  clearError,
} = actions;

export default reducer;
