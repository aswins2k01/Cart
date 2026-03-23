import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: true,
    isAuthenticated: false,
  },
  reducers: {
    loginRequest(state) {
      state.loading = true;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    loginFail(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
      state.loading = false;
    },
    registerRequest(state) {
      state.loading = true;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    registerFail(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    loadUserRequest(state) {
      state.loading = true;
    },
    loadUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    loadUserFail(state, action) {
      state.loading = false;
    },
    logoutSuccess(state) {
      state.loading = false;

      state.isAuthenticated = false;
    },
    logoutFail(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserRequest(state) {
      state.loading = true;
      state.isUpdated = false;
    },
    updateUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isUpdated = true;
    },
    updateUserFail(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.isUpdated = false;
    },
    clearUpdateUserToast(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.isUpdated = false;
    },
    changePasswordRequest(state) {
      state.loading = true;
      state.isUpdated = false;
    },
    changePasswordSuccess(state, action) {
      state.loading = false;
      state.isUpdated = true;
      state.message = action.payload.message;
    },
    changePasswordFail(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.isUpdated = false;
    },
    forgotPasswordRequest(state) {
      state.loading = true;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    clearToastMessage(state) {
      state.loading = false;
      state.message = null;
    },
    forgotPasswordFail(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    resetPasswordRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.message = action.payload.message;
      state.user = action.payload.user;
    },
    resetPasswordFail(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.isAuthenticated = false;
    },
  },
});

export const { actions, reducer } = authSlice;
export const {
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
  clearUpdateUserToast,
  changePasswordFail,
  changePasswordRequest,
  changePasswordSuccess,
  forgotPasswordRequest,
  forgotPasswordFail,
  forgotPasswordSuccess,
  resetPasswordFail,
  resetPasswordSuccess,
  resetPasswordRequest,
  clearToastMessage,
} = actions;

export default reducer;
