import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import { IOrder } from "../../../types/order";
import { CookieValueTypes } from "cookies-next";

interface ICheckout {
  loading: boolean;
  orders: IOrder[];
  order: IOrder;
  error: string | null;
}

const initialState = {
  loading: false,
  orders: [],
  order: null,
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

// Get single order
export const getSingleOrder = createAsyncThunk(
  "/order/get-one-orders",
  async (
    data: { id: string | string[]; token: CookieValueTypes },
    { rejectWithValue }
  ) => {
    const { id, token } = data;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/order/${id}`,

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
      state.orders = [...payload.orders];
    });
    builder.addCase(getAllOrders.rejected, (state) => {
      state.loading = false;
      state.orders = [];
    });
    // get single orders
    builder.addCase(getSingleOrder.pending, (state) => {
      state.loading = true;
      state.orders = state.orders;
      state.order = null;
    });
    builder.addCase(getSingleOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orders = state.orders;
      state.order = { ...payload.order };
    });
    builder.addCase(getSingleOrder.rejected, (state) => {
      state.loading = false;
      state.orders = state.orders;
      state.order = null;
    });

    // create order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.orders = null;
    });
    builder.addCase(createOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orders = state.orders;
      state.order = payload.order;
    });
    builder.addCase(createOrder.rejected, (state) => {
      state.loading = false;
      state.orders = null;
      state.order = null;
    });
  },
});

export default orderSlice.reducer;
