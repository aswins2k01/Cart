import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  clearAuthError,
  clearToast,
} from "../../actions/userActions";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../layouts/Loader";
import Metadata from "../layouts/Metadata";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { message, error, loading } = useSelector((state) => state.authState);
  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("email", email);

    dispatch(forgotPassword(formData));
  };

  useEffect(() => {
    if (message) {
      toast(message, {
        position: "bottom-center",
        type: "success",
        onOpen: () => {
          dispatch(clearToast());
        },
      });
      setEmail("");
      return;
    }
    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearAuthError());
        },
      });
      return;
    }
  }, [message, error, dispatch]);

  return (
    <Fragment>
      <Metadata title={"Forgot password"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">Forgot Password</h1>
            <div className="form-group">
              <label htmlFor="email_field">Enter Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              id="forgot_password_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                  {/* Sending... */}
                </>
              ) : (
                "Send Email"
              )}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
