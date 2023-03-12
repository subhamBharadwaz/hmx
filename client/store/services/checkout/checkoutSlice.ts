import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import { log } from "console";
import { IOrder } from "../../../types/order";
import { createOrder } from "../order/orderSlice";

interface ICheckout {
  loading: boolean;
  razorpayKey: null | string;
  error: string | null;
  paymentCompleted: boolean | null;
}

const initialState = {
  loading: false,
  razorpayKey: null,
  order: null,
  error: null,
  paymentCompleted: null,
} as ICheckout;

// get razorpay key
export const getRazorpayKey = createAsyncThunk(
  "/razorpay-key",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/razorpaykey`,
        {
          withCredentials: true,
        }
      );
      return await res.data.razorpayApiKey;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkoutActions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // razorpay key
    builder.addCase(getRazorpayKey.pending, (state) => {
      state.loading = true;
      state.razorpayKey = null;
    });
    builder.addCase(getRazorpayKey.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.razorpayKey = payload;
    });
    builder.addCase(getRazorpayKey.rejected, (state) => {
      state.loading = true;
      state.razorpayKey = null;
    });
  },
});

export default checkoutSlice.reducer;