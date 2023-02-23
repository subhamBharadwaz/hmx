import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { IWishlist } from "../../../types/wishlist";

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
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/wishlist`,
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

// create wishlist
export const createWishlist = createAsyncThunk(
  "wishlist/createWishlist",
  async (value: { productId: string }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/wishlist`,
        value,
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

// delete wishlist
export const deleteWishlistItem = createAsyncThunk(
  "wishlist/deleteWishlistItem",
  async (value: { productId: string }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/wishlist/${value.productId}`,

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

const wishlistSlice = createSlice({
  name: "wishlistActions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get all wishlist items
    builder.addCase(getWishlistItems.pending, (state) => {
      state.loading = true;
      state.wishlistData = null;
    });
    builder.addCase(getWishlistItems.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.error) {
        state.error = payload.error;
      }
      state.wishlistData = { ...payload };
    });
    builder.addCase(getWishlistItems.rejected, (state) => {
      state.loading = true;
      state.wishlistData = null;
    });

    // create wishlist
    builder.addCase(createWishlist.pending, (state) => {
      state.loading = true;
      state.wishlistData = state.wishlistData;
    });
    builder.addCase(createWishlist.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.error) {
        state.error = payload.error;
      }
      state.wishlistData = { ...payload };
    });
    builder.addCase(createWishlist.rejected, (state) => {
      state.loading = true;
      state.wishlistData = state.wishlistData;
    });

    // delete wishlist Item
    builder.addCase(deleteWishlistItem.pending, (state) => {
      state.loading = true;
      state.wishlistData = state.wishlistData;
    });
    builder.addCase(deleteWishlistItem.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.error) {
        state.error = payload.error;
      }
      state.wishlistData = { ...payload };
    });
    builder.addCase(deleteWishlistItem.rejected, (state) => {
      state.loading = true;
      state.wishlistData = state.wishlistData;
    });
  },
});

export default wishlistSlice.reducer;
