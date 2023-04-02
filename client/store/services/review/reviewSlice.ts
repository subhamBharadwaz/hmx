import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateReviewInput, IProductReview } from "../../../types/review";
import axios from "axios";

import { CookieValueTypes } from "cookies-next";

interface IReviews {
  loading: boolean;
  reviews: IProductReview[];
  review: IProductReview;
  error: string | null;
}

const initialState = {
  loading: false,
  reviews: null,
  review: null,
  error: null,
} as IReviews;

// get product reviews
export const getProductReviews = createAsyncThunk(
  "/reviews",
  async (productId: string | string[], { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/reviews?id=${productId}`,
        {
          withCredentials: true,
        }
      );

      return await res.data.reviews;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// create product review
export const createProductReview = createAsyncThunk(
  "/reviews/create",
  async (values: CreateReviewInput, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/review`,
        values,
        {
          withCredentials: true,
        }
      );

      return await res.data.review;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// delete product review
export const deleteProductReview = createAsyncThunk(
  "/reviews/delete",
  async (values: CreateReviewInput, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/review`,
        values,
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

const reviewSlice = createSlice({
  name: "userProductActions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get product reviews
    builder.addCase(getProductReviews.pending, (state) => {
      state.loading = true;
      state.reviews = null;
      state.error = null;
    });
    builder.addCase(getProductReviews.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.reviews = [...payload];
    });
    builder.addCase(getProductReviews.rejected, (state, { payload }) => {
      state.loading = true;
      state.reviews = null;
      state.error = (payload as { error: string }).error;
    });

    // create product review
    builder.addCase(createProductReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProductReview.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.review = payload;
    });
    builder.addCase(createProductReview.rejected, (state, { payload }) => {
      state.loading = true;
      state.error = (payload as { error: string }).error;
    });

    // delete product review
    builder.addCase(deleteProductReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProductReview.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(deleteProductReview.rejected, (state, { payload }) => {
      state.loading = true;
      state.error = (payload as { error: string }).error;
    });
  },
});

export default reviewSlice.reducer;
