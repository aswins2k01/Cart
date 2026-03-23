import { Fragment, useEffect } from "react";
import Metadata from "./layouts/Metadata";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Loader from "./layouts/Loader";
import Product from "./products/product";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearAuthError } from "../actions/userActions";

export default function Home() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { products, loading, error, totalItemsCount, resPerPage } = useSelector(
    (state) => state.productsState,
  );
  // const [category, setCategory] = useState("");
  const category = searchParams.get("category") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };
  // useEffect(() => {    // re render error by eslint
  //   if (location.pathname == "/") {
  //      setCategory("");
  //     setCurrentPage(1);
  //   }
  // }, [location.pathname]);

  const handleCategoryClick = (cat) => {
    setCurrentPage(1); // Reset pagination
    navigate(`/?category=${cat}`);
  };

  useEffect(() => {
    if (error) {
      return toast.error(error, {
        position: "bottom-center",
        pauseOnHover: true,
        closeOnClick: false,
        onOpen: () => dispatch(clearAuthError()),
      });
    }
    dispatch(getProducts(null, null, category, null, currentPage));
  }, [dispatch, error, category, currentPage]);

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
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Metadata title={"Buy Best Products"} />
          <h1 id="products_heading">Latest Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              <div className="col-6 col-md-3 mb-5  mt-5">
                <div className="mt-2" style={{ width: "20px" }}>
                  <h3 className="mb-3"> Categories</h3>
                  <ul className="pl-0">
                    {categories.map((category) => (
                      <li
                        style={{
                          cursor: "pointer",
                          listStyleType: "none",
                        }}
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {products?.map((product) => (
                <Product col={3} key={product._id} product={product} />
              ))}
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
  );
}
