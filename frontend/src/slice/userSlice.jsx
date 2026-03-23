import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    users: [],
    user: {},
    isUserUpdated: false,
    isUserDeleted: false,
  },
  reducers: {
    getUsersRequest(state) {
      state.loading = true;
    },
    getUsersSuccess(state, action) {
      ((state.loading = false), (state.users = action.payload.users));
    },
    getUsersFail(state, action) {
      ((state.loading = false), (state.error = action.payload));
    },
    getUserRequest(state) {
      state.loading = true;
    },
    getUserSuccess(state, action) {
      ((state.loading = false), (state.user = action.payload.user));
    },
    getUserFail(state, action) {
      ((state.loading = false), (state.error = action.payload));
    },
    clearError(state) {
      ((state.loading = false), (state.error = null));
    },
    deleteUserRequest(state) {
      state.loading = true;
    },
    deleteUserSuccess(state) {
      ((state.loading = false), (state.isUserDeleted = true));
    },
    deleteUserFail(state, action) {
      ((state.loading = false), (state.error = action.payload));
    },
    updateUserProfileRequest(state) {
      state.loading = true;
    },
    updateUserProfileSuccess(state, action) {
      ((state.loading = false),
        (state.user = action.payload.user),
        (state.isUserUpdated = true));
    },
    updateUserProfileFail(state, action) {
      ((state.loading = false), (state.error = action.payload));
    },
    clearUserUpdated(state) {
      ((state.loading = false), (state.isUserUpdated = false));
    },
    clearUserDeleted(state) {
      ((state.loading = false), (state.isUserDeleted = false));
    },
  },
});

const { actions, reducer } = userSlice;

export const {
  getUserRequest,
  getUserFail,
  getUserSuccess,
  getUsersFail,
  getUsersRequest,
  getUsersSuccess,
  deleteUserFail,
  deleteUserRequest,
  deleteUserSuccess,
  updateUserProfileFail,
  updateUserProfileRequest,
  updateUserProfileSuccess,
  clearError,
  clearUserDeleted,
  clearUserUpdated,
} = actions;

export default reducer;
