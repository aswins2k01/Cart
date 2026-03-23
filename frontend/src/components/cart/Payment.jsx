import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { Fragment, useEffect } from "react";
import { validateShipping } from "../../utils/validateShipping";
import { toast } from "react-toastify";
import { orderCompleted } from "../../slice/cartSlice";
import CheckOutSteps from "./CheckOutSteps";
import { validateOrder } from "../../utils/validateOrder";
import { validateCart } from "../../utils/validateCart";
import { createOrder } from "../../actions/orderActions";

export default function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.authState);
  const { shippingInfo } = useSelector((state) => state.cartState);
  const { error: clearOrderError, clearError } = useSelector(
    (state) => state.orderState,
  );
  const { items: cartItems } = useSelector((state) => state.cartState);
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const paymentData = {
    amount: Math.round(orderInfo && orderInfo.totalPrice * 100),
    shipping: {
      name: user.name,
      address: {
        city: shippingInfo.city,
        postal_code: shippingInfo.postalCode,
        country: shippingInfo.country,
        state: shippingInfo.state,
        line1: shippingInfo.address,
      },
      phone: shippingInfo.phoneNo,
    },
  };

  const order = {
    orderItems: cartItems,
    shippingInfo,
  };
  if (orderInfo) {
    ((order.itemsPrice = orderInfo.subTotal),
      (order.shippingPrice = orderInfo.shippingPrice),
      (order.taxPrice = orderInfo.taxPrice),
      (order.totalPrice = orderInfo.totalPrice));
  }

  useEffect(() => {
    if (cartItems.length > 0) {
      const isValidCart = validateCart(cartItems, navigate);

      if (isValidCart) {
        const isValidShipping = validateShipping(shippingInfo, navigate);
        if (isValidShipping) {
          validateOrder(navigate);
        }
      }
    }
  }, [navigate, cartItems, shippingInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    document.querySelector("#pay_btn").disabled = true;
    console.log(paymentData);

    try {
      const { data } = await axios.post("/api/v1/payment/process", paymentData);
      const clientSecret = data.client_secret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });
      if (result.error) {
        toast.error(result.error.message, {
          position: "bottom-center",
        });
      } else {
        if (result.paymentIntent.status === "succeeded") {
          toast.success("Payment success", {
            position: "bottom-center",
          });

          const finalOrder = {
            orderItems: cartItems,
            shippingInfo,
            itemsPrice: orderInfo.subTotal,
            shippingPrice: orderInfo.shippingPrice,
            taxPrice: orderInfo.taxPrice,
            totalPrice: orderInfo.totalPrice,
            paymentInfo: {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
            },
          };
          try {
            dispatch(createOrder(finalOrder));
          } catch {
            if (clearOrderError) {
              toast.error(clearOrderError, {
                position: "bottom-center",
              });
            }
          }
          dispatch(orderCompleted());

          navigate("/order/success");
        } else {
          toast.warning("Please try again", {
            position: "bottom-center",
            onOpen: dispatch(clearError()),
          });
        }
      }
    } catch (error) {}
  };

  if (!cartItems || cartItems.length === 0) {
    return null;
  }
  if (!shippingInfo) {
    return null;
  }

  if (!orderInfo) {
    return null;
  }

  return (
    <Fragment>
      <CheckOutSteps shipping confirmOrder payment />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Card Info</h1>
            <div className="form-group">
              <label htmlFor="card_num_field">Card Number</label>
              <CardNumberElement
                type="text"
                id="card_num_field"
                className="form-control"
                value=""
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_exp_field">Card Expiry</label>
              <CardExpiryElement
                type="text"
                id="card_exp_field"
                className="form-control"
                value=""
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_cvc_field">Card CVC</label>
              <CardCvcElement
                type="text"
                id="card_cvc_field"
                className="form-control"
                value=""
              />
            </div>

            <button id="pay_btn" type="submit" className="btn btn-block py-3">
              Pay - {`$${orderInfo && orderInfo.totalPrice}`}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
