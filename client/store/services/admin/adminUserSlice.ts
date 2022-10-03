import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IUser, UpdateUser } from "../../../types/user";
import axios from "axios";

import { CookieValueTypes } from "cookies-next";

interface IUsers {
  loading: boolean;
  users: IUser[];
  user: IUser;
}

const initialState = {
  loading: false,
  users: [],
  user: {},
} as IUsers;

// get all users
export const getAllUsers = createAsyncThunk(
  "admin/users",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/users`,
        {
          withCredentials: true,
        }
      );
      return await res.data.users;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// get single user details with id
export const getSingleUser = createAsyncThunk(
  "admin/user",
  async (
    data: { token: CookieValueTypes; id: string | string[] },
    { rejectWithValue }
  ) => {
    const { token, id } = data;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/user/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return await res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// update single user details with id
export const updateUserDetails = createAsyncThunk(
  "admin/user/update",
  async (
    data: { values: UpdateUser; id: string | string[] },
    { rejectWithValue }
  ) => {
    const { values, id } = data;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/user/${id}`,
        values,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// delete single user with id
export const deleteUser = createAsyncThunk(
  "admin/user/delete",
  async (id: string | string[], { rejectWithValue }) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/user/${id}`,

        {
          withCredentials: true,
        }
      );
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const adminUserActionsSlice = createSlice({
  name: "adminUserActions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // all users
    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = true;
      state.users = null;
      state.user = null;
    });
    builder.addCase(getAllUsers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.users = [...payload];
      state.user = null;
    });
    builder.addCase(getAllUsers.rejected, (state) => {
      state.loading = true;
      state.users = null;
      state.user = null;
    });

    // single user
    builder.addCase(getSingleUser.pending, (state) => {
      state.loading = true;
      state.users = state.users;
      state.user = null;
    });
    builder.addCase(getSingleUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.users = state.users;
      state.user = { ...payload };
    });
    builder.addCase(getSingleUser.rejected, (state) => {
      state.loading = true;
      state.users = state.users;
      state.user = null;
    });

    // update user details
    builder.addCase(updateUserDetails.pending, (state) => {
      state.loading = true;
      state.users = state.users;
      state.user = state.user;
    });
    builder.addCase(updateUserDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.users = state.users.map((user) =>
        user._id === payload.id ? payload : user
      );
      state.user = payload;
    });
    builder.addCase(updateUserDetails.rejected, (state) => {
      state.loading = true;
      state.users = state.users;
      state.user = state.user;
    });

    // delete user details
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.users = state.users;
    });
    builder.addCase(deleteUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.users = state.users.filter((user) => user._id !== payload);
    });
    builder.addCase(deleteUser.rejected, (state) => {
      state.loading = true;
      state.users = state.users;
    });
  },
});

export default adminUserActionsSlice.reducer;
