import { Fragment, useEffect } from "react";
import Metadata from "../layouts/Metadata";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Loader from "../layouts/Loader";
import Product from "./product";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";

export default function ProductSearch() {
  const dispatch = useDispatch();
  const [price, setPrice] = useState([1, 1000]);
  const [changedPrice, setChangedPrice] = useState([1, 1000]);
  const [category, setCategory] = useState(null);
  const [ratings, setRatings] = useState(0);

  const { products, loading, error, totalItemsCount, resPerPage } = useSelector(
    (state) => state.productsState,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  const { keyword } = useParams();

  useEffect(() => {
    if (error) {
      return toast.error(error, {
        position: "bottom-center",
        pauseOnHover: true,
        closeOnClick: false,
      });
    }
    dispatch(
      getProducts(keyword, changedPrice, category, ratings, currentPage),
    );
  }, [dispatch, error, currentPage, keyword, changedPrice, ratings, category]);

  const categories = [
    "Electronics",
    "Mobile Phones",
    "Laptops",
    "Accessories",
    "Headphones",
    "Food",
    "Books",
    "Clothes/Shoes",
    "Beauty/Health",
    "Sports",
    "Outdoor",
    "Home",
  ];

  return (
    <Fragment>
      {/* {totalItemsCount == 0 ? (
        <div className="row align-items-center " style={{ minHeight: "70vh" }}>
          <div
            className="col-12 col-md-3 mb-5 mt-5"
            style={{ minHeight: "20vh" }}
          >
            <div className="px-5" onMouseUp={() => setChangedPrice(price)}>
              <Slider
                range
                min={1}
                max={1000}
                marks={{ 1: "$1", 1000: "$1000" }}
                defaultValue={price}
                handleRender={(renderProps) => {
                  return (
                    <Tooltip overlay={`$${renderProps.props["aria-valuenow"]}`}>
                      {<div {...renderProps.props}></div>}
                    </Tooltip>
                  );
                }}
                onChange={(price) => {
                  setPrice(price);
                }}
              />
            </div>
          </div>
          <div className=" col-12 col-md-9 text-center">
            <div style={{ paddingRight: "30%" }}>
              <h1>No Match Found</h1>
              <p>Try searching for something else </p>
            </div>
          </div>
        </div>
      ) : ( */}
      <Fragment>
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <Metadata title={"Buy Best Products"} />
            <h1 id="products_heading">Search Products</h1>
            <section id="products" className="container-fluid mt-5">
              <div className="row g-0">
                <div className="col-12 col-md-3 mb-5  mt-5">
                  <div
                    className="pl-0 ml-0 mb-5 pr-5"
                    onMouseUp={() => setChangedPrice(price)}
                    onTouchEnd={() => setChangedPrice(price)}
                  >
                    <Slider
                      range
                      min={1}
                      max={1000}
                      marks={{ 1: "$1", 1000: "$1000" }}
                      defaultValue={price}
                      handleRender={(renderProps) => {
                        return (
                          <Tooltip
                            overlay={`$${renderProps.props["aria-valuenow"]}`}
                          >
                            <div {...renderProps.props}></div>
                          </Tooltip>
                        );
                      }}
                      onChange={(price) => {
                        setPrice(price);
                      }}
                    />
                  </div>
                  <hr />
                  <div className="mt-2">
                    <h3 className="mb-3"> Categories</h3>
                    <ul className="pl-0">
                      {categories.map((category) => (
                        <li
                          style={{
                            cursor: "pointer",
                            listStyleType: "none",
                            padding: "7px",
                            fontSize: "16px",
                          }}
                          key={category}
                          onClick={() => {
                            setCategory(category);
                          }}
                        >
                          {category}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <hr className="my-2" />
                  {/* Ratings Filter */}
                  <div className="mt-2">
                    <h4 className="mb-3">Ratings</h4>
                    <ul className="pl-0">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <li
                          style={{ cursor: "pointer", listStyleType: "none" }}
                          onClick={() => {
                            setRatings(star);
                          }}
                        >
                          <div className="rating-outer">
                            <div
                              className="rating-inner"
                              style={{ width: `${star * 20}%` }}
                            ></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-12 col-md-9">
                  <div className="row">
                    {products?.map((product) => (
                      <Product col={4} key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
            {totalItemsCount > 0 && totalItemsCount > resPerPage ? (
              <div className="d-flex justify-content-center mt-5">
                <Pagination
                  activePage={currentPage}
                  onChange={setCurrentPageNo}
                  totalItemsCount={totalItemsCount}
                  itemsCountPerPage={resPerPage}
                  firstPageText={"First"}
                  lastPageText={"Last"}
                  nextPageText={"Next"}
                  itemClass="page-item"
                  linkClass="page-link"
                />
              </div>
            ) : null}
          </Fragment>
        )}
      </Fragment>
      {/* )} */}
    </Fragment>
  );
}
