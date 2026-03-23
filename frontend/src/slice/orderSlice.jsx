import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    userOrders: [],
    orderDetail: {},
    adminOrders: [],
    isOrderDeleted: false,
    isOrderUpdated: false,
    totalPrice: 0,
  },

  reducers: {
    createOrderRequest(state) {
      state.loading = true;
    },
    createOrderSuccess(state, action) {
      state.orderDetail = action.payload.order;
      state.loading = false;
    },
    createOrderFail(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearError(state) {
      state.loading = false;
      state.error = null;
    },
    userOrdersRequest(state) {
      state.loading = true;
    },
    userOrdersSuccess(state, action) {
      state.userOrders = action.payload.orders;
      state.loading = false;
    },
    userOrdersFail(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    OrderDetailRequest(state) {
      state.loading = true;
    },
    OrderDetailSuccess(state, action) {
      state.orderDetail = action.payload.order;
      state.loading = false;
    },
    OrderDetailFail(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    adminOrdersRequest(state) {
      state.loading = true;
    },
    adminOrdersSuccess(state, action) {
      state.adminOrders = action.payload.orders;
      state.loading = false;
      state.totalPrice = action.payload.totalAmount;
    },
    adminOrdersFail(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    deleteOrderRequest(state) {
      state.loading = true;
    },
    deleteOrderSuccess(state) {
      state.isOrderDeleted = true;
      state.loading = false;
    },
    deleteOrderFail(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    updateOrderRequest(state) {
      state.loading = true;
    },
    updateOrderSuccess(state) {
      state.isOrderUpdated = true;
      state.loading = false;
    },
    updateOrderFail(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearOrderDeleted(state) {
      state.isOrderDeleted = false;
      state.loading = false;
    },
    clearOrderUpdated(state) {
      state.isOrderUpdated = false;

      state.loading = false;
    },
  },
});

export const { actions, reducer } = orderSlice;
export const {
  createOrderRequest,
  createOrderSuccess,
  createOrderFail,
  clearError,
  userOrdersSuccess,
  userOrdersRequest,
  userOrdersFail,
  OrderDetailRequest,
  OrderDetailFail,
  OrderDetailSuccess,
  adminOrdersFail,
  adminOrdersRequest,
  adminOrdersSuccess,
  updateOrderFail,
  updateOrderRequest,
  updateOrderSuccess,
  deleteOrderFail,
  deleteOrderRequest,
  deleteOrderSuccess,
  clearOrderDeleted,
  clearOrderUpdated,
} = actions;

export default reducer;
