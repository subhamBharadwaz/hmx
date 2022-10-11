import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateLoginUserInput, IUser } from "../../../types/user";
import axios from "axios";
import { CookieValueTypes } from "cookies-next";
import { CreateRegisterUserInput } from "../../../types/user";
import setAuthToken from "../../../utils/setAuthToken";

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
}

const initialState = {
  token: tokenFromLocalStorage || null,
  isAuthenticated: false,
  loading: null,
  user: null,
} as IAuthState;

// Logged in user details
export const userDetails = createAsyncThunk(
  "auth/userdetails",
  async (_, { rejectWithValue }) => {
    if (tokenFromLocalStorage) {
      setAuthToken(tokenFromLocalStorage);
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/userdetails`,
        {
          withCredentials: true,
        }
      );

      return await res.data;
    } catch (err) {
      return rejectWithValue(err);
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
      return await res.data;
    } catch (err) {
      return rejectWithValue(err);
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
      return await res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/logout`,
        {
          withCredentials: true,
        }
      );
      localStorage.removeItem("token");
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // user details
    builder.addCase(userDetails.pending, (state) => {
      state.loading = true;
      state.isAuthenticated = false;
      state.token = tokenFromLocalStorage;
      state.user = null;
    });
    builder.addCase(userDetails.fulfilled, (state, { payload }) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.token = tokenFromLocalStorage;
      state.user = { ...payload };
    });
    builder.addCase(userDetails.rejected, (state) => {
      state.isAuthenticated = false;
      state.loading = true;
      state.token = null;
      state.user = null;
    });

    // register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.isAuthenticated = false;
      state.token = tokenFromLocalStorage;
    });
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.token = localStorage.setItem("token", payload.token);
      state.user = { ...payload };
    });
    builder.addCase(registerUser.rejected, (state, { payload }) => {
      state.isAuthenticated = false;
      state.loading = true;
      state.token = null;
    });

    // login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.isAuthenticated = false;
      state.token = tokenFromLocalStorage;
    });
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.token = localStorage.setItem("token", payload.token);
      state.user = { ...payload };
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.isAuthenticated = false;
      state.loading = true;
      state.token = null;
    });

    // logout
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.isAuthenticated = true;
      state.token = tokenFromLocalStorage;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.token = null;
    });
    builder.addCase(logoutUser.rejected, (state) => {
      state.isAuthenticated = null;
      state.loading = true;
      state.token = null;
    });
  },
});

export default authSlice.reducer;
