import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { validateShipping } from "../../utils/validateShipping";
import { useEffect, Fragment } from "react";
import Metadata from "../layouts/Metadata";
import CheckOutSteps from "./CheckOutSteps";
import { validateCart } from "../../utils/validateCart";

export default function ConfirmOrder() {
  const { shippingInfo, items: cartItems } = useSelector(
    (state) => state.cartState,
  );
  const { user } = useSelector((state) => state.authState);
  const navigate = useNavigate();

  useEffect(() => {
    const isValidCart = validateCart(cartItems, navigate);

    if (isValidCart) {
      validateShipping(shippingInfo, navigate);
    }
  }, [navigate, cartItems, shippingInfo]);

  if (
    !cartItems ||
    cartItems.length === 0 ||
    !shippingInfo ||
    !shippingInfo.address
  ) {
    return null; // This prevents the HTML below from ever being seen
  }

  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingPrice = subTotal > 200 ? 0 : 25;
  let taxPrice = 0.05 * subTotal;
  const totalPrice = Number(shippingPrice + taxPrice + subTotal).toFixed(2);
  taxPrice = Number(taxPrice).toFixed(2);

  const paymentProcess = () => {
    const data = { subTotal, shippingPrice, totalPrice, taxPrice };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/payment");
  };

  // useEffect(() => {
  //   validateCart(cartItems, navigate);
  // }, [navigate, cartItems]);

  // if (!shippingInfo) {
  //   return null;
  // }
  // if (!cartItems || cartItems.length === 0) {
  //   return null;
  // }

  return (
    <Fragment>
      <Metadata title={"Confirm order"} />
      <CheckOutSteps shipping confirmOrder />
      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 order-confirm">
          <h4 className="mb-3">Shipping Info</h4>
          <p>
            <b>Name:</b> {user.name}
          </p>
          <p>
            <b>Phone:</b> {shippingInfo.phoneNo}
          </p>
          <p className="mb-4">
            <b>Address:</b> {shippingInfo.address}, {shippingInfo.city},{" "}
            {shippingInfo.state}, {shippingInfo.postalCode},{" "}
            {shippingInfo.country}
          </p>

          <hr />
          <h4 className="mt-4">Your Cart Items:</h4>

          <hr />

          {cartItems.map((item) => (
            <Fragment key={item.product}>
              {" "}
              <div className="cart-item my-1">
                <div className="row">
                  <div className="col-4 col-lg-2">
                    <img src={item.image} alt="Laptop" height="45" width="65" />
                  </div>

                  <div className="col-5 col-lg-6">
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </div>

                  <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                    <p>
                      {item.quantity} x ${item.price} ={" "}
                      <b>${item.quantity * item.price}</b>
                    </p>
                  </div>
                </div>
              </div>
              <hr />{" "}
            </Fragment>
          ))}
        </div>

        <div className="col-12 col-lg-3 my-4">
          <div id="order_summary">
            <h4>Order Summary</h4>
            <hr />
            <p>
              Subtotal:{" "}
              <span className="order-summary-values">${subTotal}</span>
            </p>
            <p>
              Shipping:{" "}
              <span className="order-summary-values">${shippingPrice}</span>
            </p>
            <p>
              Tax: <span className="order-summary-values">${taxPrice}</span>
            </p>

            <hr />

            <p>
              Total: <span className="order-summary-values">${totalPrice}</span>
            </p>

            <hr />
            <button
              id="checkout_btn"
              className="btn btn-primary btn-block"
              onClick={paymentProcess}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
