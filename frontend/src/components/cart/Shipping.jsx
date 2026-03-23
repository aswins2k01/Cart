import { Fragment, useEffect, useState } from "react";
import countries from "country-list";

import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../../slice/cartSlice";
// import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CheckOutSteps from "./CheckOutSteps";
import { validateCart } from "../../utils/validateCart";

export default function Shipping() {
  const { shippingInfo = {} } = useSelector((state) => state.cartState);
  const { items: cartItems } = useSelector((state) => state.cartState);
  const dispatch = useDispatch();
  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [phoneNo, setphoneNo] = useState(shippingInfo.phoneNo || "");
  const [postalCode, setpostalCode] = useState(shippingInfo.postalCode || "");
  const [state, setState] = useState(shippingInfo.state || "");
  const [country, setCountry] = useState(shippingInfo.country || "");
  const navigate = useNavigate();

  const shippingHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingInfo({
        address,
        city,
        phoneNo,
        postalCode,
        state,
        country,
      }),
    );
    navigate("/order/confirm");
  };

  useEffect(() => {
    validateCart(cartItems, navigate);
  }, [cartItems, navigate]);

  const countryList = countries.getData();

  if (!cartItems || cartItems.length == 0) {
    return null;
  }
  return (
    <Fragment>
      <CheckOutSteps shipping />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={shippingHandler}>
            <h1 className="mb-4">Shipping Info</h1>
            <div className="form-group">
              <label htmlFor="address_field">Address</label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city_field">City</label>
              <input
                type="text"
                id="city_field"
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_field">Phone No</label>
              <input
                type="phone"
                id="phone_field"
                className="form-control"
                value={phoneNo}
                onChange={(e) => setphoneNo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="postalCode_field">Postal Code</label>
              <input
                type="number"
                id="postalCode_field"
                className="form-control"
                value={postalCode}
                onChange={(e) => setpostalCode(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="state_field">State</label>
              <input
                type="text"
                id="state_field"
                className="form-control"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="country_field">Country</label>
              <select
                id="country_field"
                className="form-control"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {countryList.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="shipping_btn"
              type="submit"
              className="btn btn-block py-3"
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
}
