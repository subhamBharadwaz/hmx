import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  CreateChangePasswordInput,
  CreateLoginUserInput,
  CreateUpdateUserInput,
  IUser,
} from "../../../types/user";
import axios from "axios";
import { CookieValueTypes, setCookie } from "cookies-next";
import { CreateRegisterUserInput } from "../../../types/user";
import setAuthToken from "../../../utils/setAuthToken";
import { RootState } from "../../index";

let tokenFromLocalStorage: string;

if (typeof window !== "undefined") {
  // Perform localStorage action
  tokenFromLocalStorage = localStorage.getItem("token");
}

export interface IAuthState {
  token: string | CookieValueTypes | void;
  isAuthenticated: boolean;
  loading: boolean;
  user: IUser | null;
  error: string | null;
}

const initialState = {
  token: tokenFromLocalStorage || null,
  isAuthenticated: false,
  loading: null,
  user: null,
  error: null,
} as IAuthState;

// Logged in user details
export const userDetails = createAsyncThunk(
  "auth/userdetails",
  async (_, { getState, rejectWithValue }) => {
    const { token } = (getState() as RootState).auth;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/userdetails`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      return res.data.user;
    } catch (err) {
      if (err.response.status === 401) {
        // If the access token is expired, try refreshing it and retry the request
        console.log("sending refresh token req");
        try {
          const refreshResult = await axios.get<{ accessToken: string }>(
            `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/refresh`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          const newAccessToken = refreshResult.data.accessToken;
          if (newAccessToken) {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/userdetails`,
              {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
                withCredentials: true,
              }
            );
            return response.data.user;
          }
        } catch (error) {
          // If refreshing the access token fails, log the user out
          // Or, you can redirect them to the login page
          return rejectWithValue({ error: "Failed to refresh access token" });
        }
      }
      return rejectWithValue(err.response.data);
    }
  }
);

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (values: CreateRegisterUserInput, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/register`,
        values,
        {
          headers: {
            "Content-Type": "Multipart/Form-Data",
          },
          withCredentials: true,
        }
      );
      return await res.data.accessToken;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (values: CreateLoginUserInput, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/login`,

        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return await res.data.accessToken;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/logout`,
        {
          withCredentials: true,
        }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("auth");
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// update user dashboard
export const updateUserDetails = createAsyncThunk(
  "auth/update-user-details",
  async (values: CreateUpdateUserInput, { getState, rejectWithValue }) => {
    const { token } = (getState() as RootState).auth;
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/userdashboard/update`,
        values,
        {
          headers: {
            "Content-Type": "Multipart/Form-Data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return await res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// update user password
export const updateUserPassword = createAsyncThunk(
  "auth/update-user-details/password",
  async (values: CreateChangePasswordInput, { getState, rejectWithValue }) => {
    const { token } = (getState() as RootState).auth;
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/password/update`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return await res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get user details
    builder.addCase(userDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.user = null;
    });
    builder.addCase(userDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = null;
      state.user = { ...payload };
    });
    builder.addCase(userDetails.rejected, (state, { payload }) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
      state.error = (payload as { error: string }).error;
    });

    // update user details
    builder.addCase(updateUserDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload.user;
      state.error = null;
    });
    builder.addCase(updateUserDetails.rejected, (state, { payload }) => {
      state.loading = false;
      state.user = state.user;
      state.error = (payload as { error: string }).error;
    });

    // update user password
    builder.addCase(updateUserPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserPassword.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.token = payload.accessToken;
      state.error = null;
    });
    builder.addCase(updateUserPassword.rejected, (state, { payload }) => {
      state.loading = false;
      state.token = state.token;
      state.error = (payload as { error: string }).error;
    });

    // register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = null;
      state.token = payload.accessToken;
      localStorage.setItem("token", payload.accessToken);
    });
    builder.addCase(registerUser.rejected, (state, { payload }) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.token = null;

      state.error = (payload as { error: string }).error;
    });

    // login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.isAuthenticated = false;

      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = null;
      state.token = payload;
      localStorage.setItem("token", payload);
    });
    builder.addCase(loginUser.rejected, (state, { payload }) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.token = null;

      state.error = (payload as { error: string }).error;
    });

    // logout
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.isAuthenticated = true;
      state.user = state.user;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      state.user = null;
      state.error = null;
    });
    builder.addCase(logoutUser.rejected, (state, { payload }) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.token = null;
      state.user = state.user;
      state.error = (payload as { error: string }).error;
    });
  },
});

export default authSlice.reducer;
