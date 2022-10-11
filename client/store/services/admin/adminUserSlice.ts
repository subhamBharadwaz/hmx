import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IUser, UpdateUser } from "../../../types/user";
import axios from "axios";

import { CookieValueTypes } from "cookies-next";

interface IUsers {
  loading: boolean;
  users: {
    users: IUser[];
  };
  user: IUser;
  success: boolean;
}

const initialState = {
  loading: false,
  users: {
    users: [],
  },
  user: {},
  success: false,
} as IUsers;

// get all users
export const getAllUsers = createAsyncThunk(
  "admin/users",
  async (page: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/users?page=${page}`,
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
      return await res.data.user;
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
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.user;
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

const adminUserSlice = createSlice({
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
      state.users = { ...payload };
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
      state.success = false;
    });
    builder.addCase(updateUserDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.users.users = state.users.users.map((user) =>
        user._id === payload.id ? payload : user
      );
      state.user = payload;
      state.success = true;
    });
    builder.addCase(updateUserDetails.rejected, (state) => {
      state.loading = true;
      state.users = state.users;
      state.user = state.user;
      state.success = false;
    });

    // delete user details
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.users = state.users;
      state.success = false;
    });
    builder.addCase(deleteUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.users.users = state.users.users.filter(
        (user) => user._id !== payload
      );
      state.success = true;
    });
    builder.addCase(deleteUser.rejected, (state) => {
      state.loading = true;
      state.users = state.users;
      state.success = false;
    });
  },
});

export default adminUserSlice.reducer;
