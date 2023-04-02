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
      return rejectWithValue(err.response.data);
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
      return rejectWithValue(err.response.data);
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
      return rejectWithValue(err.response.data);
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
      state.error = null;
    });
    builder.addCase(getAllOrders.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orders = [...payload.orders];
      state.error = null;
    });
    builder.addCase(getAllOrders.rejected, (state, { payload }) => {
      state.loading = false;
      state.orders = [];
      state.error = (payload as { error: string }).error;
    });
    // get single orders
    builder.addCase(getSingleOrder.pending, (state) => {
      state.loading = true;
      state.orders = state.orders;
      state.order = null;
      state.error = null;
    });
    builder.addCase(getSingleOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orders = state.orders;
      state.order = { ...payload.order };
      state.error = null;
    });
    builder.addCase(getSingleOrder.rejected, (state, { payload }) => {
      state.loading = false;
      state.orders = state.orders;
      state.order = null;
      state.error = (payload as { error: string }).error;
    });

    // create order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.orders = null;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orders = state.orders;
      state.order = payload.order;
      state.error = null;
    });
    builder.addCase(createOrder.rejected, (state, { payload }) => {
      state.loading = false;
      state.orders = null;
      state.order = null;
      state.error = (payload as { error: string }).error;
    });
  },
});

export default orderSlice.reducer;
