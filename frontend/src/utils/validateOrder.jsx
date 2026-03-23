import { toast } from "react-toastify";

export const validateOrder = (navigate) => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  if (!orderInfo) {
    toast.warning("Please confirm the order details to proceed", {
      position: "bottom-center",
    });
    navigate("/order/confirm");
    return;
  }
};
