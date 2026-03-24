import React from "react";
import Search from "./Search";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DropdownButton, Dropdown, Image } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { logoutUser } from "../../actions/userActions";

export default function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cartState);
  const logoutHandler = () => {
    dispatch(logoutUser());
  };
  const profileHandler = () => {
    navigate("/myProfile");
  };

  // console.log("Current user avatar value:", user?.avatar);
  // console.log("Type of avatar:", typeof user?.avatar);
  return (
    <nav className="navbar row">
      <div className="col-12 col-md-3">
        <div className="navbar-brand">
          <Link to={"/"}>
            <img width="150px" src="/logo.png" />
          </Link>
        </div>
      </div>

      <div className="col-12 col-md-6 mt-2 mt-md-0">
        <Search />
      </div>

      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        {isAuthenticated ? (
          <Dropdown className="d-inline">
            <Dropdown.Toggle
              variant="default text-white pr-5"
              id="dropdown-basic"
            >
              <figure className="avatar avatar-nav">
                <Image
                  width="50px"
                  src={user?.avatar || "/images/default_avatar.png"}
                  // onError={(e) => {   //it happens when the browser fails to download the image
                  //   e.target.onerror = null; // Prevents infinite loops if default is also missing
                  //   e.target.src = "/images/default_avatar.png";
                  // }}
                />
              </figure>
              <span>{user?.name}</span>
            </Dropdown.Toggle>
            <DropdownMenu className="dropdown-menu px-3">
              {user.role == "admin" && (
                <DropdownItem
                  onClick={() => navigate("/admin/dashboard")}
                  className="text-dark px-0 "
                >
                  Dashboard
                </DropdownItem>
              )}
              <DropdownItem
                onClick={profileHandler}
                className="text-dark px-0 "
              >
                Profile
              </DropdownItem>
              <DropdownItem
                as={Link}
                to="/myorders"
                className="text-dark px-0 "
              >
                My orders
              </DropdownItem>
              <DropdownItem
                onClick={logoutHandler}
                className="text-danger px-0 "
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Link to="/login" className="btn" id="login_btn">
            Login
          </Link>
        )}

        <Link to="/cart">
          <span id="cart" className="ml-3">
            Cart
          </span>
        </Link>
        <span className="ml-1" id="cart_count">
          {items.length}
        </span>
      </div>
    </nav>
  );
}
