import { useEffect, useState } from "react";
import {
  updatePassword as updatePasswordAction,
  clearAuthError,
} from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function UpdatePassword() {
  const [oldPassword, setoldPassword] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { message, error } = useSelector((state) => state.authState);
  const submitHandler = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("oldPassword", oldPassword);
    formdata.append("Password", password);
    dispatch(updatePasswordAction(formdata));
    setPassword("");
    setoldPassword("");
  };

  useEffect(() => {
    if (message) {
      toast(message, {
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
  }, [message, error, dispatch]);

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow-lg" onSubmit={submitHandler}>
          <h1 className="mt-2 mb-5">Update Password</h1>
          <div className="form-group">
            <label htmlFor="old_password_field">Old Password</label>
            <input
              type="password"
              id="old_password_field"
              className="form-control"
              value={oldPassword}
              onChange={(e) => setoldPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="new_password_field">New Password</label>
            <input
              type="password"
              id="new_password_field"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
