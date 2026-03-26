import { useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { orderDetail as orderDetailAction } from "../../actions/orderActions";
import { Link, useParams } from "react-router-dom";
import Loader from "../layouts/Loader";

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(orderDetailAction(id));
  }, [dispatch, id]);

  const { orderDetail = {}, loading } = useSelector(
    (state) => state.orderState,
  );
  const {
    shippingInfo = {},
    orderItems = [],
    user = {},
    totalPrice = 0,
    orderStatus = "Processing",
    paymentInfo = {},
  } = orderDetail;

  const isPaid =
    paymentInfo && paymentInfo.status === "succeeded" ? true : false;

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="row d-flex justify-content-between">
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
                {shippingInfo.address},{shippingInfo.city}, {shippingInfo.state}
                ,{shippingInfo.postalCode}, {shippingInfo.country}
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
                  orderStatus === "Delivered" ? "greenColor" : "redColor"
                }
              >
                <b>{orderStatus}</b>
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
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
