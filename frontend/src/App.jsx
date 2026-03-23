import "./App.css";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./components/Home";
import Login from "./components/User/Login";
import ProductDetails from "./components/products/productDetails";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductSearch from "./components/products/productSearch";
import Register from "./components/user/Register";
import store from "./store";
import { useEffect } from "react";
import { loadUser } from "./actions/userActions";
import { useSelector } from "react-redux";
import { clearAuthError } from "./actions/userActions";
import Profile from "./components/User/Profile";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import OrderSuccess from "./components/cart/OrderSuccess";
import Dashboard from "./components/admin/Dashboard";

import { useState } from "react";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "./components/cart/Payment";
import Loader from "./components/layouts/Loader";
import Myorders from "./components/order/Myorders";
import OrderDetail from "./components/order/OrderDetail";
import ProductList from "./components/admin/ProductList";
import NewProduct from "./components/admin/NewProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrderList from "./components/admin/OrderList";
import UpdateOrder from "./components/admin/UpdateOrder";
import UsersList from "./components/admin/UsersList";
import UpdateUser from "./components/admin/UpdateUser";
import ReviewList from "./components/admin/ReviewList";
const UserLayout = ({ children }) => (
  <div className="container container-fluid">{children}</div>
);

// Then in your routes:
<Route
  path="/"
  element={
    <UserLayout>
      <Home />
    </UserLayout>
  }
/>;

function App() {
  const { error } = useSelector((state) => state.authState);
  // const [stripeApiKey, setStripeApiKey] = useState();
  const [stripePromise, setStripePromise] = useState(null);
  useEffect(() => {
    store.dispatch(loadUser());
    async function getStripeApiKey() {
      const { data } = await axios.get("/api/v1/stripeapi");
      // setStripeApiKey(data.stripeApiKey);
      setStripePromise(loadStripe(data.stripeApiKey));
    }
    getStripeApiKey();
  }, []);
  useEffect(() => {
    if (error) {
      store.dispatch(clearAuthError());
      return;
    }
  }, [error]);
  return (
    <>
      {/* <Router> */}
      <div className="App">
        <HelmetProvider>
          <Header />
          {/* <div className="container container-fluid"> */}
          <ToastContainer theme="dark" />
          <Routes>
            <Route
              path="/"
              element={
                <UserLayout>
                  <Home />
                </UserLayout>
              }
            />
            <Route
              path="/search/:keyword"
              element={
                <UserLayout>
                  <ProductSearch />
                </UserLayout>
              }
            />
            <Route
              path="/product/:id"
              element={
                <UserLayout>
                  <ProductDetails />
                </UserLayout>
              }
            />
            <Route
              path="/login"
              element={
                <UserLayout>
                  <Login />
                </UserLayout>
              }
            />
            <Route
              path="/register"
              element={
                <UserLayout>
                  <Register />
                </UserLayout>
              }
            />
            <Route
              path="/myProfile/password/change"
              element={
                <ProtectedRoute>
                  <UserLayout>
                    {" "}
                    <UpdatePassword />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/myProfile"
              element={
                <ProtectedRoute>
                  <UserLayout>
                    <Profile />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/myProfile/update"
              element={
                <ProtectedRoute>
                  <UserLayout>
                    <UpdateProfile />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route
              path="/password/reset/:token"
              element={
                <UserLayout>
                  <ResetPassword />
                </UserLayout>
              }
            />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/shipping"
              element={
                <ProtectedRoute>
                  <UserLayout>
                    <Shipping />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/confirm"
              element={
                <ProtectedRoute>
                  <UserLayout>
                    <ConfirmOrder />
                  </UserLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment"
              element={
                stripePromise ? (
                  <ProtectedRoute>
                    <UserLayout>
                      <Elements stripe={stripePromise}>
                        <Payment />
                      </Elements>
                    </UserLayout>
                  </ProtectedRoute>
                ) : (
                  <div>
                    <Loader />
                  </div>
                )
              }
            />

            <Route
              path="/order/success"
              element={
                <ProtectedRoute>
                  <UserLayout>
                    <OrderSuccess />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/myorders"
              element={
                <ProtectedRoute>
                  <UserLayout>
                    <Myorders />
                  </UserLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <UserLayout>
                    <OrderDetail />
                  </UserLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin routes*/}

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute isAdmin={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/products"
              element={
                <ProtectedRoute isAdmin={true}>
                  <ProductList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/product/create"
              element={
                <ProtectedRoute isAdmin={true}>
                  <NewProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/product/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <UpdateProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute isAdmin={true}>
                  <OrderList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/order/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <UpdateOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute isAdmin={true}>
                  <UsersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <UpdateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <ProtectedRoute isAdmin={true}>
                  <ReviewList />
                </ProtectedRoute>
              }
            />
          </Routes>
          {/* </div> */}

          <Footer />
        </HelmetProvider>
      </div>
      {/* </Router> */}
    </>
  );
}

export default App;
