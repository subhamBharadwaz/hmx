import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import { IOrder } from "../../../types/order";

interface ICheckout {
  loading: boolean;
  orders: IOrder[];
  error: string | null;
}

const initialState = {
  loading: false,
  orders: [],
  error: null,
} as ICheckout;

// Get logged in users orders
export const getAllOrders = createAsyncThunk(
  "/order/get-all-orders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/myorder`,

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

// create Order
export const createOrder = createAsyncThunk(
  "/order/create-order",
  async (orderDetails: IOrder, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/order/create`,
        orderDetails,
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

const orderSlice = createSlice({
  name: "orderActions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get all orders
    builder.addCase(getAllOrders.pending, (state) => {
      state.loading = true;
      state.orders = [];
    });
    builder.addCase(getAllOrders.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orders = { ...payload.order };
    });
    builder.addCase(getAllOrders.rejected, (state) => {
      state.loading = false;
      state.orders = [];
    });

    // create order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.orders = null;
    });
    builder.addCase(createOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orders = { ...payload.order };
    });
    builder.addCase(createOrder.rejected, (state) => {
      state.loading = false;
      state.orders = null;
    });
  },
});

export default orderSlice.reducer;
