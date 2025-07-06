import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  getConnectionsRequest,
  sendConnectionRequest,
  getMyConnectionsRequest,
  loginUser,
  registerUser,
  AcceptConnection,
} from "../../action/authAction";

const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  connections: [], //mene kis kis ko connection bheja
  connectionRequest: [], //mere pass kon kon se connection hai
  all_users: [],
  all_profiles_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "Hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        (state.isLoading = true), (state.message = "Knocking the door...");
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = {
          message: "Login is Successfull",
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        // state.isSuccess=false;
        // state.loggedIn=false;
        state.message = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering you...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        // state.loggedIn=true;
        state.message = {
          message: "Registration is successfull, Please login",
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload;
        // state.connections=action.payload.connections;
        // state.connectionRequest=action.payload.connectionRequest;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        (state.all_profiles_fetched = true),
          (state.all_users = action.payload.profiles);
      })
      .addCase(getConnectionsRequest.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(getConnectionsRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyConnectionsRequest.fulfilled, (state, action) => {
        state.connectionRequest = action.payload;
      })
      .addCase(getMyConnectionsRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(AcceptConnection.fulfilled, (state, action) => {
        state.message = { message: "Connection Updated" };
      })
      .addCase(AcceptConnection.rejected, (state, action) => {
        state.message = { message: action.payload };
      });
  },
});

export const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere } =
  authSlice.actions;
export default authSlice.reducer;
