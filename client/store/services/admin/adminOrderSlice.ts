import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateProductInput, IProduct } from "../../../types/product";
import axios from "axios";

import { CookieValueTypes } from "cookies-next";
import { IOrder } from "../../../types/order";

interface IOrderData {
  loading: boolean;
  orders: IOrder[];
  order: IOrder;
  error: string | null;
  message: string;
}

const initialState = {
  loading: false,
  orders: [],
  order: null,
  error: null,
  message: null,
} as IOrderData;

export const adminGetAllOrders = createAsyncThunk(
  "admin/orders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/orders`,
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

export const adminGetSingleOrder = createAsyncThunk(
  "admin/orders/one-order",
  async (
    data: { token: CookieValueTypes; id: string | string[] },
    { rejectWithValue }
  ) => {
    const { token, id } = data;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/orders/${id}`,
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

export const adminUpdateSingleOrder = createAsyncThunk(
  "admin/orders/update",
  async (
    data: { orderStatus: string; id: string | string[] },
    { rejectWithValue }
  ) => {
    const { orderStatus, id } = data;

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/orders/${id}`,
        { orderStatus },
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

export const adminDeleteSingleOrder = createAsyncThunk(
  "admin/orders/delete",
  async (id: string | string[], { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/orders/${id}`,
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

const adminOrderSlice = createSlice({
  name: "adminOrderActions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get all orders
    builder.addCase(adminGetAllOrders.pending, (state) => {
      state.loading = true;
      state.orders = [];
    });
    builder.addCase(adminGetAllOrders.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.error) {
        state.error = payload.error;
      }
      state.orders = [...payload.orders];
    });
    builder.addCase(adminGetAllOrders.rejected, (state) => {
      state.loading = false;
      state.orders = [];
    });

    // get single order
    builder.addCase(adminGetSingleOrder.pending, (state) => {
      state.loading = true;
      state.orders = state.orders;
      state.order = null;
    });
    builder.addCase(adminGetSingleOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orders = state.orders;
      if (payload.error) {
        state.error = payload.error;
      }
      state.order = { ...payload.order };
    });
    builder.addCase(adminGetSingleOrder.rejected, (state) => {
      state.loading = false;
      state.orders = state.orders;
      state.order = null;
    });

    // update order
    builder.addCase(adminUpdateSingleOrder.pending, (state) => {
      state.loading = true;
      state.orders = null;
      state.order = state.order;
    });
    builder.addCase(adminUpdateSingleOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orders = state.orders;
      if (payload.error) {
        state.error = payload.error;
      }
      state.order = { ...payload.order };
    });
    builder.addCase(adminUpdateSingleOrder.rejected, (state) => {
      state.loading = false;
      state.orders = null;
      state.order = state.order;
    });

    // delete order
    builder.addCase(adminDeleteSingleOrder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(adminDeleteSingleOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      // @ts-ignore
      if (payload.error) {
        // @ts-ignore
        state.error = payload.error;
      }
      state.orders = state.orders.filter((order) => order._id !== payload);
    });
    builder.addCase(adminDeleteSingleOrder.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default adminOrderSlice.reducer;
