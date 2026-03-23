import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { clearError, clearOrderDeleted } from "../../slice/orderSlice";
import {
  adminOrders as adminOrdersAction,
  deleteOrder,
} from "../../actions/orderActions";
import { MDBDataTable } from "mdbreact";
import Loader from "../layouts/Loader";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";

export default function OrderList() {
  const {
    adminOrders = [],
    error,
    loading,
    isOrderDeleted,
  } = useSelector((state) => state.orderState);

  const dispatch = useDispatch();

  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes , delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteOrder(id));
      }
    });
  };

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Number Of Items",
          field: "noOfItems",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
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
    adminOrders.forEach((order) =>
      data.rows.push({
        id: order._id,
        noOfItems: order.orderItems.length,
        amount: `$${order.totalPrice}`,
        status: (
          <p
            style={{
              color: order.orderStatus.includes("Processing") ? "red" : "green",
            }}
          >
            {order.orderStatus}
          </p>
        ),
        actions: (
          <Fragment>
            <Link to={`/admin/order/${order._id}`} className="btn btn-primary">
              <i className="fa fa-pencil"></i>
            </Link>
            <Button
              onClick={(e) => deleteHandler(e, order._id)}
              className="btn btn-danger py-1 px-2 ml-2"
            >
              <i className="fa fa-trash"></i>
            </Button>
          </Fragment>
        ),
      }),
    );
    return data;
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-center",
        onOpen: () => dispatch(clearError()),
      });
    }

    if (isOrderDeleted) {
      Swal.fire("Deleted!", "The Order has been removed.", "success");
      dispatch(clearOrderDeleted());
      return;
    }
    dispatch(adminOrdersAction());
  }, [dispatch, error, isOrderDeleted]);

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4">Order List</h1>
        <Fragment>
          {" "}
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={setOrders()}
              hover
              striped
              bordered
              className="px-3"
            ></MDBDataTable>
          )}
        </Fragment>
      </div>
    </div>
  );
}
