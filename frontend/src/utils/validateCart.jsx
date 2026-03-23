import { toast } from "react-toastify";

export const validateCart = (cartItems, navigate) => {
  if (!cartItems || cartItems.length == 0) {
    toast.warning("Please add products into cart to proceed", {
      position: "bottom-center",
    });
    navigate("/");
    return false;
  }
  return true;
};
