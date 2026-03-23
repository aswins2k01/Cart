import axios from "axios";
import {
  createOrderSuccess,
  createOrderRequest,
  createOrderFail,
  userOrdersRequest,
  userOrdersSuccess,
  userOrdersFail,
  OrderDetailRequest,
  OrderDetailSuccess,
  OrderDetailFail,
  adminOrdersRequest,
  adminOrdersSuccess,
  adminOrdersFail,
  deleteOrderRequest,
  deleteOrderSuccess,
  deleteOrderFail,
  updateOrderRequest,
  updateOrderSuccess,
  updateOrderFail,
} from "../slice/orderSlice";

export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch(createOrderRequest());

    const { data } = await axios.post("/api/v1/order/new", order);

    dispatch(createOrderSuccess(data));
  } catch (error) {
    dispatch(createOrderFail(error.response.data.message));
  }
};
export const userOrders = () => async (dispatch) => {
  try {
    dispatch(userOrdersRequest());

    const { data } = await axios.get("/api/v1/myOrders");

    dispatch(userOrdersSuccess(data));
  } catch (error) {
    dispatch(userOrdersFail(error.response.data.message));
  }
};
export const orderDetail = (id) => async (dispatch) => {
  try {
    dispatch(OrderDetailRequest());

    const { data } = await axios.get(`/api/v1/order/${id}`);

    dispatch(OrderDetailSuccess(data));
  } catch (error) {
    dispatch(OrderDetailFail(error.response.data.message));
  }
};

export const adminOrders = () => async (dispatch) => {
  try {
    dispatch(adminOrdersRequest());

    const { data } = await axios.get("/api/v1/admin/allOrders");

    dispatch(adminOrdersSuccess(data));
  } catch (error) {
    dispatch(adminOrdersFail(error.response.data.message));
  }
};

export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch(deleteOrderRequest());

    await axios.delete(`/api/v1/admin/order/${id}`);

    dispatch(deleteOrderSuccess());
  } catch (error) {
    dispatch(deleteOrderFail(error.response.data.message));
  }
};

export const updateOrder = (id, orderData) => async (dispatch) => {
  try {
    dispatch(updateOrderRequest());

    const { data } = await axios.put(`/api/v1/admin/order/${id}`, orderData);

    dispatch(updateOrderSuccess(data));
  } catch (error) {
    dispatch(updateOrderFail(error.response.data.message));
  }
};
