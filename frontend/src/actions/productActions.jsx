import axios from "axios";
import {
  productsFail,
  productsRequest,
  productsSuccess,
  adminProductsFail,
  adminProductsRequest,
  adminProductsSuccess,
} from "../slice/productsSlice";
import {
  createNewProductFail,
  createNewProductRequest,
  createNewProductSuccess,
  createReviewFail,
  createReviewRequest,
  createReviewSuccess,
  deleteProductFail,
  deleteProductRequest,
  deleteProductSuccess,
  deleteReviewFail,
  deleteReviewRequest,
  deleteReviewSuccess,
  getReviewsFail,
  getReviewsRequest,
  getReviewsSuccess,
  productFail,
  productRequest,
  productSuccess,
  updateProductFail,
  updateProductRequest,
  updateProductSuccess,
} from "../slice/productSlice";

export const getProducts =
  (keyword, price, category, rating, currentPage) => async (dispatch) => {
    try {
      dispatch(productsRequest());
      let link = `/api/v1/products?page=${currentPage}`;

      if (keyword) {
        link += `&keyword=${keyword}`;
      }

      if (price) {
        link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
      }
      if (category) {
        link += `&category=${category}`;
      }
      if (rating) {
        link += `&ratings=${rating}`;
      }
      const { data } = await axios.get(link);
      dispatch(productsSuccess(data));
    } catch (error) {
      dispatch(productsFail(error.response.data.message));
    }
  };

export const getProduct = (id) => async (dispatch) => {
  try {
    dispatch(productRequest());
    const { data } = await axios.get(`/api/v1/product/${id}`);
    dispatch(productSuccess(data));
    // console.log(data);
  } catch (error) {
    dispatch(productFail(error.response.data.message));
  }
};
export const createReview = (reviewData) => async (dispatch) => {
  try {
    dispatch(createReviewRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put("/api/v1/review", reviewData, config);
    dispatch(createReviewSuccess(data));
    // console.log(data);
  } catch (error) {
    dispatch(createReviewFail(error.response.data.message));
  }
};

export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch(adminProductsRequest());

    const { data } = await axios.get("/api/v1/admin/products");
    dispatch(adminProductsSuccess(data));
  } catch (error) {
    dispatch(adminProductsFail(error.response.data.message));
  }
};
export const createNewProduct = (productData) => async (dispatch) => {
  try {
    dispatch(createNewProductRequest());

    const { data } = await axios.post("/api/v1/admin/product/new", productData);
    dispatch(createNewProductSuccess(data));
  } catch (error) {
    dispatch(createNewProductFail(error.response.data.message));
  }
};
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());

    await axios.delete(`/api/v1/admin/product/${id}`);
    dispatch(deleteProductSuccess());
  } catch (error) {
    dispatch(deleteProductFail(error.response.data.message));
  }
};
export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch(updateProductRequest());

    await axios.put(`/api/v1/admin/product/${id}`, productData);
    dispatch(updateProductSuccess());
  } catch (error) {
    dispatch(updateProductFail(error.response.data.message));
  }
};

export const getReviews = (productId) => async (dispatch) => {
  try {
    dispatch(getReviewsRequest());

    const { data } = await axios.get("/api/v1/admin/reviews", {
      params: { productId },
    });
    dispatch(getReviewsSuccess(data));
  } catch (error) {
    dispatch(getReviewsFail(error.response.data.message));
  }
};

export const deleteReview = (productId, reviewId) => async (dispatch) => {
  try {
    dispatch(deleteReviewRequest());

    await axios.delete("/api/v1/admin/review", {
      params: { productId, reviewId },
    });
    dispatch(deleteReviewSuccess());
  } catch (error) {
    dispatch(deleteReviewFail(error.response.data.message));
  }
};
