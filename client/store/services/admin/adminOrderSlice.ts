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
}

const initialState = {
  loading: false,
  orders: [],
  order: null,
  error: null,
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
      return rejectWithValue(err.response.data);
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
      return rejectWithValue(err.response.data);
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
      return rejectWithValue(err.response.data);
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
      state.error = null;
    });
    builder.addCase(adminGetAllOrders.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.orders = [...payload.orders];
    });
    builder.addCase(adminGetAllOrders.rejected, (state, { payload }) => {
      state.loading = false;
      state.orders = [];
      state.error = (payload as { error: string }).error;
    });

    // get single order
    builder.addCase(adminGetSingleOrder.pending, (state) => {
      state.loading = true;
      state.orders = state.orders;
      state.order = null;
      state.error = null;
    });
    builder.addCase(adminGetSingleOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orders = state.orders;
      state.error = null;
      state.order = { ...payload.order };
    });
    builder.addCase(adminGetSingleOrder.rejected, (state, { payload }) => {
      state.loading = false;
      state.orders = state.orders;
      state.order = null;
      state.error = (payload as { error: string }).error;
    });

    // update order
    builder.addCase(adminUpdateSingleOrder.pending, (state) => {
      state.loading = true;
      state.orders = null;
      state.order = state.order;
      state.error = null;
    });
    builder.addCase(adminUpdateSingleOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.orders = state.orders;
      state.order = { ...payload.order };
    });
    builder.addCase(adminUpdateSingleOrder.rejected, (state, { payload }) => {
      state.loading = false;
      state.orders = null;
      state.order = state.order;
      state.error = (payload as { error: string }).error;
    });

    // delete order
    builder.addCase(adminDeleteSingleOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(adminDeleteSingleOrder.fulfilled, (state, { payload }) => {
      state.loading = false;

      state.orders = state.orders.filter((order) => order._id !== payload);
    });
    builder.addCase(adminDeleteSingleOrder.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = (payload as { error: string }).error;
    });
  },
});

export default adminOrderSlice.reducer;
