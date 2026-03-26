import axios from "axios";
import { addCartItemRequest, addCartItemSuccess } from "../slice/cartSlice";

export const addCartItems = (product_Id, quantity) => async (dispatch) => {
  try {
    dispatch(addCartItemRequest());

    const { data } = await axios.get(`/api/v1/product/${product_Id}`);
    dispatch(
      addCartItemSuccess({
        product: data.product._id,
        stock: data.product.stock,
        image: data.product.images[0].url || data.product.images[0].image,
        name: data.product.name,
        price: data.product.price * quantity,
        quantity,
      }),
    );
  } catch (error) {}
};
