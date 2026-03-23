import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, getUser } from "../../actions/userActions";
import { clearError, clearUserUpdated } from "../../slice/userSlice";
import { toast } from "react-toastify";
import Loader from "../layouts/Loader";

export default function UpdateUser() {
  const {
    loading,
    isUserUpdated,
    error,
    user = {},
  } = useSelector((state) => state.userState);
  const { user: authUser = {} } = useSelector((state) => state.authState);

  const { id: userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (isUserUpdated) {
      toast.success("User Updated Successfully", {
        position: "bottom-center",

        onOpen: () => {
          dispatch(clearUserUpdated());
        },
      });
      dispatch(getUser(userId));

      return;
    }
    if (error) {
      toast.error(error, {
        position: "bottom-center",

        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }
  }, [isUserUpdated, error, dispatch, navigate, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(getUser(userId));
    }
  }, [dispatch, userId]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);

    formData.append("role", role);
    dispatch(updateUser(userId, formData));
  };

  useEffect(() => {
    if (user._id) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  return (
    <Fragment>
      {!user._id ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="row">
            <div className="col-12 col-md-2">
              <Sidebar />
            </div>
            <div className="col-12 col-md-10">
              <div className="wrapper my-5">
                <form
                  className="shadow-lg"
                  encType="multipart/form-data"
                  onSubmit={submitHandler}
                >
                  <h1 className="mb-4">Update User</h1>

                  <div className="form-group">
                    <label htmlFor="name_field">Name</label>
                    <input
                      type="text"
                      id="name_field"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email_field">Email</label>
                    <input
                      type="text"
                      id="email_field"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="role_field">Role</label>
                    <select
                      onChange={(e) => setRole(e.target.value)}
                      className="form-control"
                      id="role_field"
                      value={role}
                      disabled={user._id === authUser._id}
                    >
                      <option value="admin">admin</option>
                      <option value="user">user</option>
                    </select>
                  </div>

                  <button
                    id="update_button"
                    type="submit"
                    className="btn btn-block py-3"
                    disabled={loading}
                  >
                    UPDATE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
