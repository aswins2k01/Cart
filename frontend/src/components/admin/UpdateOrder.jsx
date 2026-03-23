import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  orderDetail as orderDetailAction,
  updateOrder,
} from "../../actions/orderActions";
import { clearError, clearOrderUpdated } from "../../slice/orderSlice";
import { toast } from "react-toastify";
import Loader from "../layouts/Loader";
import OrderDetail from "../order/OrderDetail";

export default function UpdateOrder() {
  const { loading, isOrderUpdated, error, orderDetail } = useSelector(
    (state) => state.orderState,
  );

  const {
    shippingInfo = {},
    paymentInfo = {},
    user,
    totalPrice = 0,
    orderItems = [],
  } = orderDetail;
  const isPaid = paymentInfo?.status?.includes("success") ? true : false;
  const { id: orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState("Processing");

  useEffect(() => {
    if (isOrderUpdated) {
      toast.success("Order Updated Successfully", {
        position: "bottom-center",

        onOpen: () => {
          dispatch(clearOrderUpdated());
        },
      });

      return;
    }
    if (error) {
      toast.error(error, {
        position: "bottom-center",

        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }
  }, [isOrderUpdated, error, dispatch, navigate, orderId]);

  useEffect(() => {
    if (orderId) {
      dispatch(orderDetailAction(orderId));
    }
  }, [dispatch, orderId, isOrderUpdated]);

  const submitHandler = (e) => {
    e.preventDefault();
    const orderData = {};
    orderData.orderStatus = orderStatus;
    dispatch(updateOrder(orderId, orderData));
  };

  useEffect(() => {
    if (orderDetail._id) {
      setOrderStatus(orderDetail.orderStatus);
    }
  }, [orderDetail]);

  return (
    <Fragment>
      {!orderDetail._id ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="row">
            <div className="col-12 col-md-2">
              <Sidebar />
            </div>
            <div className="col-12 col-md-10">
              <div className="row d-flex justify-content-around">
                <div className="col-12 col-lg-8 mt-5 order-details">
                  <h1 className="my-5">Order # {orderDetail._id}</h1>

                  <h4 className="mb-4">Shipping Info</h4>
                  <p>
                    <b>Name:</b> {user?.name}
                  </p>
                  <p>
                    <b>Phone:</b> {shippingInfo.phoneNo}
                  </p>
                  <p className="mb-4">
                    <b>Address:</b>
                    {shippingInfo.address},{shippingInfo.city},{" "}
                    {shippingInfo.state},{shippingInfo.postalCode},{" "}
                    {shippingInfo.country}
                  </p>
                  <p>
                    <b>Amount:</b> ${totalPrice}
                  </p>

                  <hr />

                  <h4 className="my-4">Payment</h4>
                  <p className={isPaid ? "greenColor" : "redColor"}>
                    <b>{isPaid ? "PAID" : "UNPAID"}</b>
                  </p>

                  <h4 className="my-4">Order Status:</h4>
                  <p
                    className={
                      orderDetail.orderStatus === "Delivered"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    <b>{orderDetail.orderStatus}</b>
                  </p>

                  <h4 className="my-4">Order Items:</h4>

                  <hr />
                  {orderItems &&
                    orderItems.map((item) => (
                      <Fragment key={item._id}>
                        <div className="cart-item my-1">
                          <div className="row my-5">
                            <div className="col-4 col-lg-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                height="45"
                                width="65"
                              />
                            </div>

                            <div className="col-5 col-lg-5">
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                            </div>

                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                              <p>${item.price}</p>
                            </div>

                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                              <p>{item.quantity} Piece(s)</p>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </Fragment>
                    ))}
                </div>
                <div className="col-12 col-lg-3 mt-5 ">
                  <h4>Orderstatus</h4>
                  <div className="form-group">
                    <select
                      className="form-control"
                      onChange={(e) => setOrderStatus(e.target.value)}
                      value={orderStatus}
                      name="status"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={submitHandler}
                    disabled={loading}
                  >
                    Update status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
