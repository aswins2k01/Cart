import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    items: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
  reducers: {
    addCartItemRequest(state) {
      state.loading = true;
    },
    addCartItemSuccess(state, action) {
      const item = action.payload;
      const isItemExist = state.items.find((i) => i.product == item.product);
      if (isItemExist) {
        state.loading = false;
      } else {
        state.items = [...state.items, item];
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },
    increaseCartItemQty(state, action) {
      state.items.map((item) => {
        if (item.product == action.payload) {
          item.quantity = item.quantity + 1;
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    decreaseCartItemQty(state, action) {
      state.items.map((item) => {
        if (item.product == action.payload) {
          item.quantity = item.quantity - 1;
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    removeCartItem(state, action) {
      const filterItems = state.items.filter(
        (item) => item.product !== action.payload,
      );
      state.items = filterItems;
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    saveShippingInfo(state, action) {
      localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
      state.shippingInfo = action.payload;
    },
    orderCompleted(state) {
      localStorage.removeItem("shippingInfo");
      localStorage.removeItem("cartItems");
      sessionStorage.removeItem("orderInfo");
      state.items = [];
      state.loading = false;
      state.shippingInfo = {};
    },
  },
});

export const { actions, reducer } = productSlice;
export const {
  addCartItemRequest,
  addCartItemSuccess,
  increaseCartItemQty,
  decreaseCartItemQty,
  removeCartItem,
  saveShippingInfo,
  orderCompleted,
} = actions;

export default reducer;
