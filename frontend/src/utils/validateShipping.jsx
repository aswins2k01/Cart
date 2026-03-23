// src/utils/validateShipping.js
import { toast } from "react-toastify";

export const validateShipping = (shippingInfo, navigate) => {
  if (
    !shippingInfo.address ||
    !shippingInfo.phoneNo ||
    !shippingInfo.country ||
    !shippingInfo.postalCode ||
    !shippingInfo.state ||
    !shippingInfo.city
  ) {
    toast.error("Please fill the Shipping Info", { position: "bottom-center" });
    navigate("/shipping");
    return false;
  }
  return true;
};
