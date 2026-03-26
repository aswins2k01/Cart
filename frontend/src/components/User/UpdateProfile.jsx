import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { clearAuthError, updateProfile } from "../../actions/userActions";
import { toast } from "react-toastify";
import { clearUpdateUserToast } from "../../slice/authSlice";
import Metadata from "../layouts/Metadata";

export default function UpdateProfile() {
  const { user, isUpdated, error } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar?.url || user?.avatar || "/images/default_avatar.png",
  );

  const onchange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(e.target.files[0]);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);

    formData.append("avatar", avatar);
    dispatch(updateProfile(formData));
  };

  useEffect(() => {
    // This error is a more "modern" linting warning. React is telling you that using useEffect just to
    // copy data from one state (Redux user) into another state (Local setName) is
    // often unnecessary and can lead to performance lags called "cascading renders."
    // if (user) {
    //   setName(user.name);
    //   setEmail(user.email);
    // }
    // if (user.avatar) {
    //   setAvatarPreview(user.avatar);
    // }

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
    if (isUpdated) {
      toast("Profile Updated Successfully", {
        position: "bottom-center",
        type: "success",
        onOpen: () => dispatch(clearUpdateUserToast()),
      });
    }
  }, [user, dispatch, error, isUpdated, setName, setEmail, setAvatarPreview]);
  return (
    <Fragment>
      <Metadata title={"Update Profile"} />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow-lg"
            onSubmit={submitHandler}
            encType="multipart/form-data"
          >
            <h1 className="mt-2 mb-5">Update Profile</h1>

            <div className="form-group">
              <label htmlFor="name_field">Name</label>
              <input
                type="name"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatar_upload">Avatar</label>
              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img
                      src={avatarPreview}
                      className="rounded-circle"
                      alt="Avatar Preview"
                    />
                  </figure>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    onChange={onchange}
                    className="custom-file-input"
                    id="customFile"
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn update-btn btn-block mt-4 mb-3"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
