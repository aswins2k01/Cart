import { Fragment, useEffect, useState } from "react";
import { createReview, getProduct } from "../../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../layouts/Loader";
import { Carousel, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Metadata from "../layouts/Metadata";
import { addCartItems } from "../../actions/cartActions";
import { toast } from "react-toastify";
import ProductReview from "./ProductReview";
import {
  clearProduct,
  clearError,
  clearIsReviewSubmitted,
} from "../../slice/productSlice";

export default function ProductDetails() {
  const {
    loading,
    product = {},
    isReviewSubmitted,
    error,
  } = useSelector((state) => state.productState);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const increaseQty = () => {
    const count = document.querySelector(".count");
    if (product.stock == 0 || count.valueAsNumber >= product.stock) return;
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };
  const decreaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber == 1) return;
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  useEffect(() => {
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch]); // Empty array means this runs only on mount/unmount

  useEffect(() => {
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }
    if (isReviewSubmitted) {
      toast("Review Submitted successfully", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearIsReviewSubmitted()),
      });
      dispatch(getProduct(id));
      return;
    }
    if (!loading && (!product._id || !product._id == id)) {
      dispatch(getProduct(id));
    }
  }, [dispatch, id, isReviewSubmitted, error]);

  const addCartItemsHandler = () => {
    dispatch(addCartItems(product._id, quantity));
    toast.success("Product Added successfully", {
      position: "bottom-center",
    });
  };

  const reviewHandler = () => {
    handleClose();
    setRating(1);
    const formData = new FormData();
    formData.append("ratings", rating);
    formData.append("comment", comment);
    formData.append("productId", id);
    dispatch(createReview(formData));
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Metadata title={product.name} />
          <div className="row f-flex justify-content-around">
            <div className="col-12 col-lg-5 img-fluid" id="product_image">
              <Carousel pause="hover">
                {product.images?.map((image) => (
                  <Carousel.Item key={image._id}>
                    <img
                      className="d-block w-100"
                      src={image.url || image.image}
                      alt={product.name}
                      height="500"
                      width="500"
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>

            <div className="col-12 col-lg-5 mt-5">
              <h3>{product.name}</h3>
              <p id="product_id">Product # {product._id}</p>

              <hr />

              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{ width: `${(product.ratings / 5) * 100}%` }}
                ></div>
              </div>

              <span id="no_of_reviews">{product.reviews?.length} Reviews</span>

              <hr />

              <p id="product_price">${product.price}.00</p>
              <div className="stockCounter d-inline">
                <span className="btn btn-danger minus" onClick={decreaseQty}>
                  -
                </span>

                <input
                  type="number"
                  className="form-control count d-inline"
                  value={quantity}
                  readOnly
                />

                <span className="btn btn-primary plus" onClick={increaseQty}>
                  +
                </span>
              </div>
              <button
                type="button"
                id="cart_btn"
                className="btn btn-primary d-inline ml-4"
                disabled={product.stock == 0 ? true : false}
                onClick={addCartItemsHandler}
              >
                Add to Cart
              </button>

              <hr />

              <p>
                Status:
                <span
                  id="stock_status"
                  className={product.stock > 0 ? "greenColor" : "redColour"}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock "}
                </span>
              </p>

              <hr />

              <h4 className="mt-2">Description:</h4>
              <p>{product.description}</p>
              <hr />
              <p id="product_seller mb-3">
                Sold by: <strong>{product.seller}</strong>
              </p>

              <button
                id="review_btn"
                type="button"
                className="btn btn-primary mt-4"
                data-toggle="modal"
                data-target="#ratingModal"
                onClick={handleShow}
              >
                Submit Your Review
              </button>

              <div className="row mt-2 mb-5">
                <div className="rating w-50">
                  <div
                    className="modal fade"
                    id="ratingModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="ratingModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="ratingModalLabel">
                            Submit Review
                          </h5>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <ul className="stars">
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                            <li className="star">
                              <i className="fa fa-star"></i>
                            </li>
                          </ul>

                          <textarea
                            name="review"
                            id="review"
                            className="form-control mt-3"
                          ></textarea>

                          <button
                            className="btn my-3 float-right review-btn px-4 text-white"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Modal
                    show={show}
                    onHide={() => {
                      (handleClose(), setRating(1));
                    }}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Submit Review</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <ul className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <li
                            key={star}
                            className={`star ${star <= rating ? "orange" : ""}`}
                            onClick={() => setRating(star)}
                            value={star}
                            onMouseOver={(e) =>
                              e.target.classList.add("yellow")
                            }
                            onMouseOut={(e) =>
                              e.target.classList.remove("yellow")
                            }
                          >
                            <i className="fa fa-star"></i>
                          </li>
                        ))}
                      </ul>

                      <textarea
                        name="review"
                        id="review"
                        className="form-control mt-3"
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                      <button
                        aria-label="close"
                        className=" btn review-btn float-right text-white my-3 px-4"
                        onClick={reviewHandler}
                      >
                        Submit
                      </button>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
          {product.reviews && product.reviews.length > 0 ? (
            <ProductReview reviews={product.reviews} />
          ) : null}
        </Fragment>
      )}
    </Fragment>
  );
}
