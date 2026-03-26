import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  clearError,
  clearReviewDeleted,
  clearReviews,
} from "../../slice/productSlice";
import { getReviews, deleteReview } from "../../actions/productActions";
import { MDBDataTable } from "mdbreact";
import Loader from "../layouts/Loader";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import { useState } from "react";

export default function ReviewList() {
  const {
    reviews = [],
    error,
    loading,
    isReviewDeleted,
  } = useSelector((state) => state.productState);

  //   const { productId } = useParams();
  const [productId, setProductId] = useState("");

  const dispatch = useDispatch();

  const setReviews = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "User",
          field: "user",
          sort: "asc",
        },
        {
          label: "Ratings",
          field: "ratings",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
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
    reviews?.forEach((review) =>
      data.rows.push({
        id: review._id,
        user: review.user,
        ratings: review.ratings,
        comment: review.comment,
        actions: (
          <Fragment>
            <Button
              onClick={(e) => deleteHandler(e, review._id)}
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

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(getReviews(productId));
  };

  const deleteHandler = (e, reviewId) => {
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
        dispatch(deleteReview(productId, reviewId));
      }
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-center",
        onOpen: () => dispatch(clearError()),
      });
    }

    if (isReviewDeleted) {
      Swal.fire("Deleted!", "The Order has been removed.", "success");
      dispatch(clearReviewDeleted());
      dispatch(getReviews(productId));
      return;
    }

    return () => {
      dispatch(clearReviews());
    };
  }, [dispatch, error, isReviewDeleted, productId]);

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4">Review List</h1>
        <div className="row justify-content-center mt-5">
          <div className="col-5">
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <label>Product ID</label>
                <input
                  type="text"
                  onChange={(e) => setProductId(e.target.value)}
                  className="form-control"
                  value={productId}
                />
              </div>
              <button
                disabled={loading}
                className="btn btn-primary btn-block py-2"
              >
                Search
              </button>
            </form>
          </div>
        </div>
        <div></div>
        <Fragment>
          {" "}
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={setReviews()}
              hover
              striped
              bordered
              responsive
              scrollX
              className="px-3"
            ></MDBDataTable>
          )}
        </Fragment>
      </div>
    </div>
  );
}
