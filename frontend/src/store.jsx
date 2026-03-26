import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import { thunk } from "redux-thunk";
import productsReducer from "./slice/productsSlice";
// console.log("Is productsReducer defined?", productsReducer);
import productReducer from "./slice/productSlice";
import authReducer from "./slice/authSlice";
import cartReducer from "./slice/cartSlice";
import orderReducer from "./slice/orderSlice";
import userReducer from "./slice/userSlice";

const reducer = combineReducers({
  productsState: productsReducer,
  productState: productReducer,
  authState: authReducer,
  cartState: cartReducer,
  orderState: orderReducer,
  userState: userReducer,
});

const store = configureStore({
  reducer,
  //   middleware: [thunk],
  // devTools: false,
});

export default store;
