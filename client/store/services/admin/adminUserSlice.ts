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
  error: string | null;
}

const initialState = {
  loading: false,
  users: {
    users: [],
  },
  user: {},
  error: null,
} as IUsers;

// get all users
export const getAllUsers = createAsyncThunk(
  "admin/users",
  async (
    query: { page?: string; role?: string[]; searchQ?: string },
    { rejectWithValue }
  ) => {
    const { page, role, searchQ } = query;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/users?role=${
          role || "All"
        }&search=${searchQ || ""}&page=${page}`,
        {
          withCredentials: true,
        }
      );
      return await res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// get single user details with id
export const getSingleUser = createAsyncThunk(
  "admin/user",
  async (data: { id: string | string[] }, { rejectWithValue }) => {
    const { id } = data;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/user/${id}`,
        {
          withCredentials: true,
        }
      );

      return await res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
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
      return rejectWithValue(err.response.data);
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
      return rejectWithValue(err.response.data);
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
      state.error = null;
    });
    builder.addCase(getAllUsers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.users = { ...payload };
      state.user = null;
    });
    builder.addCase(getAllUsers.rejected, (state, { payload }) => {
      state.loading = true;
      state.users = null;
      state.user = null;
      state.error = (payload as { error: string }).error;
    });

    // single user
    builder.addCase(getSingleUser.pending, (state) => {
      state.loading = true;
      state.users = state.users;
      state.user = null;
      state.error = null;
    });
    builder.addCase(getSingleUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.users = state.users;
      state.user = { ...payload.user };
    });
    builder.addCase(getSingleUser.rejected, (state, { payload }) => {
      state.loading = true;
      state.users = state.users;
      state.user = null;
      state.error = (payload as { error: string }).error;
    });

    // update user details
    builder.addCase(updateUserDetails.pending, (state) => {
      state.loading = true;
      state.users = state.users;
      state.user = state.user;
      state.error = null;
    });
    builder.addCase(updateUserDetails.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.users.users = state.users.users.map((user) =>
        user._id === payload.id ? payload : user
      );
      state.user = payload;
    });
    builder.addCase(updateUserDetails.rejected, (state, { payload }) => {
      state.loading = true;
      state.users = state.users;
      state.user = state.user;
      state.error = (payload as { error: string }).error;
    });

    // delete user details
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.users = state.users;
      state.error = null;
    });
    builder.addCase(deleteUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.users.users = state.users.users.filter(
        (user) => user._id !== payload
      );
    });
    builder.addCase(deleteUser.rejected, (state, { payload }) => {
      state.loading = true;
      state.users = state.users;

      state.error = (payload as { error: string }).error;
    });
  },
});

export default adminUserSlice.reducer;
