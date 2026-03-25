import axios from "axios";
import {
  loginRequest,
  loginSuccess,
  loginFail,
  clearError,
  registerRequest,
  registerSuccess,
  registerFail,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateUserRequest,
  updateUserSuccess,
  updateUserFail,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFail,
  forgotPasswordRequest,
  forgotPasswordFail,
  forgotPasswordSuccess,
  resetPasswordFail,
  resetPasswordSuccess,
  resetPasswordRequest,
  clearToastMessage,
} from "../slice/authSlice";
import {
  deleteUserFail,
  deleteUserRequest,
  deleteUserSuccess,
  getUserFail,
  getUserRequest,
  getUsersFail,
  getUsersRequest,
  getUsersSuccess,
  getUserSuccess,
  updateUserProfileFail,
  updateUserProfileRequest,
  updateUserProfileSuccess,
} from "../slice/userSlice";
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post("/api/v1/login", { email, password });
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFail(error.response.data.error));
  }
};

export const clearAuthError = () => (dispatch) => {
  dispatch(clearError());
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const { data } = await axios.post("/api/v1/register", userData, config);
    dispatch(registerSuccess(data));
  } catch (error) {
    dispatch(registerFail(error.response.data.message));
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loadUserRequest());

    const { data } = await axios.get("/api/v1/myProfile");
    dispatch(loadUserSuccess(data));
  } catch (error) {
    const message = error.response.data.message;

    if (message === "Login first to access the resource") {
      dispatch(loadUserFail());
    } else if (error.response.data.message === "jwt malformed") {
      dispatch(loadUserFail(null));
    } else {
      dispatch(loadUserFail(error.response.data.message));
    }
    // console.warn("Silent Check: No active session found.");
    // dispatch({ type: "LOAD_USER_FINISH" });
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await axios.get("/api/v1/logout");
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFail(error.response.data.message));
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateUserRequest());
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const { data } = await axios.put(
      "/api/v1/myProfile/update",
      userData,
      config,
    );
    dispatch(updateUserSuccess(data));
  } catch (error) {
    dispatch(updateUserFail(error.response.data.message));
  }
};

export const updatePassword = (userData) => async (dispatch) => {
  try {
    dispatch(changePasswordRequest());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(
      "/api/v1/myProfile/password/change",
      userData,
      config,
    );
    dispatch(changePasswordSuccess(data));
  } catch (error) {
    dispatch(changePasswordFail(error.response.data.message));
  }
};

export const forgotPassword = (userData) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/v1/password/forgot",
      userData,
      config,
    );
    dispatch(forgotPasswordSuccess(data));
  } catch (error) {
    dispatch(forgotPasswordFail(error.response.data.message));
  }
};

export const clearToast = () => (dispatch) => {
  dispatch(clearToastMessage());
};

export const resetPassword = (userData, token) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      `/api/v1/password/reset/${token}`,
      userData,
      config,
    );
    dispatch(resetPasswordSuccess(data));
  } catch (error) {
    dispatch(resetPasswordFail(error.response.data.message));
  }
};

export const getUsers = () => async (dispatch) => {
  try {
    dispatch(getUsersRequest());

    const { data } = await axios.get("/api/v1/admin/users");

    dispatch(getUsersSuccess(data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message; // axios library & always there will be a string
    dispatch(getUsersFail(errorMessage));
  }
};
export const getUser = (id) => async (dispatch) => {
  try {
    dispatch(getUserRequest());
    const { data } = await axios.get(`/api/v1/admin/users/${id}`);
    dispatch(getUserSuccess(data));
  } catch (error) {
    dispatch(getUserFail(error.response.data.message));
  }
};

export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch(updateUserProfileRequest());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(
      `/api/v1/admin/users/${id}`,
      userData,
      config,
    );
    dispatch(updateUserProfileSuccess(data));
  } catch (error) {
    dispatch(updateUserProfileFail(error.response.data.message));
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch(deleteUserRequest());
    const { data } = await axios.delete(`/api/v1/admin/users/${id}`);
    dispatch(deleteUserSuccess(data));
  } catch (error) {
    dispatch(deleteUserFail(error.response.data.message));
  }
};
