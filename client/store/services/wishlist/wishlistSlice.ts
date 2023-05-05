import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { IWishlist } from "../../../types/wishlist";
import { RootState } from "../../index";

interface IWishlistData {
  loading: boolean;
  wishlistData: IWishlist;
  error: string | null;
}

const initialState = {
  loading: false,
  wishlistData: null,
  error: null,
} as IWishlistData;

// get all wishlist items
export const getWishlistItems = createAsyncThunk(
  "wishlist",
  async (_, { getState, rejectWithValue }) => {
    const { token } = (getState() as RootState).auth;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/wishlist`,
        {
          headers: {
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

// create wishlist
export const createWishlist = createAsyncThunk(
  "wishlist/createWishlist",
  async (value: { productId: string }, { getState, rejectWithValue }) => {
    const { token } = (getState() as RootState).auth;
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/wishlist`,
        value,
        {
          headers: {
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

// delete wishlist
export const deleteWishlistItem = createAsyncThunk(
  "wishlist/deleteWishlistItem",
  async (value: { productId: string }, { getState, rejectWithValue }) => {
    const { token } = (getState() as RootState).auth;
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/wishlist/${value.productId}`,

        {
          headers: {
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

const wishlistSlice = createSlice({
  name: "wishlistActions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get all wishlist items
    builder.addCase(getWishlistItems.pending, (state) => {
      state.loading = true;
      state.wishlistData = null;
      state.error = null;
    });
    builder.addCase(getWishlistItems.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.wishlistData = { ...payload };
    });
    builder.addCase(getWishlistItems.rejected, (state, { payload }) => {
      state.loading = false;
      state.wishlistData = null;
      state.error = (payload as { error: string }).error;
    });

    // create wishlist
    builder.addCase(createWishlist.pending, (state) => {
      state.loading = true;
      state.wishlistData = state.wishlistData;
      state.error = null;
    });
    builder.addCase(createWishlist.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.wishlistData = { ...payload };
    });
    builder.addCase(createWishlist.rejected, (state, { payload }) => {
      state.loading = false;
      state.wishlistData = state.wishlistData;
      state.error = (payload as { error: string }).error;
    });

    // delete wishlist Item
    builder.addCase(deleteWishlistItem.pending, (state) => {
      state.loading = true;
      state.wishlistData = state.wishlistData;
      state.error = null;
    });
    builder.addCase(deleteWishlistItem.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.wishlistData = { ...payload };
    });
    builder.addCase(deleteWishlistItem.rejected, (state, { payload }) => {
      state.loading = false;
      state.wishlistData = state.wishlistData;
      state.error = (payload as { error: string }).error;
    });
  },
});

export default wishlistSlice.reducer;
