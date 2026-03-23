import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearAuthError, resetPassword } from "../../actions/userActions";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message, error, isAuthenticated } = useSelector(
    (state) => state.authState,
  );
  const { token } = useParams();
  const submitHandler = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("password", password);
    formdata.append("confirmPassword", confirmPassword);
    dispatch(resetPassword(formdata, token));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (isAuthenticated) {
      toast("Password Changed Successfully", {
        position: "bottom-center",
        type: "success",
      });
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
  }, [message, error, dispatch, isAuthenticated, navigate]);
  return (
    <div className="container-container-fluid">
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">New Password</h1>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password_field">Confirm Password</label>
              <input
                type="password"
                id="confirm_password_field"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              id="new_password_button"
              type="submit"
              className="btn btn-block py-3"
            >
              Set Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
