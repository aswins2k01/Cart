import { Fragment } from "react";
import { Link } from "react-router-dom";
import Metadata from "../layouts/Metadata";

export default function OrderSuccess() {
  return (
    <Fragment>
      <Metadata title={"order summary"} />
      <div class="row justify-content-center">
        <div class="col-6 mt-5 text-center">
          <img
            class="my-5 img-fluid d-block mx-auto"
            src="/images/success.png"
            alt="Order Success"
            width="200"
            height="200"
          />

          <h2>Your Order has been placed successfully.</h2>

          <Link to="/myorders">Go to Orders</Link>
        </div>
      </div>
    </Fragment>
  );
}
