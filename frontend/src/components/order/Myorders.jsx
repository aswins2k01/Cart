import { useSelector, useDispatch } from "react-redux";
import Metadata from "../layouts/Metadata";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import { useEffect, Fragment } from "react";
import { userOrders as userOrdersAction } from "../../actions/orderActions";
export default function Myorders() {
  const dispatch = useDispatch();
  const { userOrders } = useSelector((state) => state.orderState);

  useEffect(() => {
    dispatch(userOrdersAction());
  }, [dispatch]);
  const setData = () => {
    const data = {
      columns: [
        {
          label: "Order ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Number of Items",
          field: "numOfItems",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "price",
          sort: "asc",
        },
        {
          label: "Status",
          field: "status",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    userOrders &&
      userOrders.forEach((order) =>
        data.rows.push({
          id: order._id,
          numOfItems: order.orderItems.length,
          price: `$${order.totalPrice}`,
          status:
            order.orderStatus && order.orderStatus.includes("Delivered") ? (
              <p style={{ color: "green" }}>{order.orderStatus}</p>
            ) : (
              <p style={{ color: "red" }}>{order.orderStatus}</p>
            ),
          actions: (
            <Link to={`/order/${order._id}`} className="btn btn-primary">
              <i className="fa fa-eye"></i>
            </Link>
          ),
        }),
      );
    return data;
  };
  return (
    <Fragment>
      <Metadata title="Myorders" />
      <h1 className="mt-5">My Orders</h1>
      <MDBDataTable className="px-5" striped hover bordered data={setData()} />
    </Fragment>
  );
}
