import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateProductInput, IProduct } from "../../../types/product";
import axios from "axios";

import { CookieValueTypes } from "cookies-next";
import { IOrder } from "../../../types/order";
import { RootState } from "../../index";

interface IOrderData {
  loading: boolean;
  orders: IOrder[];
  order: IOrder;
  total: number | null;
  totalDeliveredOrders: number | null;
  error: string | null;
}

const initialState = {
  loading: false,
  orders: [],
  order: null,
  total: null,
  totalDeliveredOrders: null,
  error: null,
} as IOrderData;

export const adminGetAllOrders = createAsyncThunk(
  "admin/orders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = (getState() as RootState).auth;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/orders`,
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

export const adminGetTotalNumberOfOrders = createAsyncThunk(
  "admin/orders/total",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = (getState() as RootState).auth;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/orders/total`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return await res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const adminGetTotalDeliveredOrders = createAsyncThunk(
  "admin/orders/total-delivered-orders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = (getState() as RootState).auth;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/orders/total-delivered-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return await res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const adminGetAllRecentOrders = createAsyncThunk(
  "admin/orders/recent",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = (getState() as RootState).auth;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/orders/recent`,
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

export const adminGetSingleOrder = createAsyncThunk(
  "admin/orders/one-order",
  async (data: { id: string | string[] }, { getState, rejectWithValue }) => {
    const { id } = data;
    try {
      const { token } = (getState() as RootState).auth;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/orders/${id}`,
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

export const adminUpdateSingleOrder = createAsyncThunk(
  "admin/orders/update",
  async (
    data: { orderStatus: string; id: string | string[] },
    { getState, rejectWithValue }
  ) => {
    const { orderStatus, id } = data;

    try {
      const { token } = (getState() as RootState).auth;
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/orders/${id}`,
        { orderStatus },
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

export const adminDeleteSingleOrder = createAsyncThunk(
  "admin/orders/delete",
  async (id: string | string[], { getState, rejectWithValue }) => {
    try {
      const { token } = (getState() as RootState).auth;
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

    // get total number of orders
    builder.addCase(adminGetTotalNumberOfOrders.pending, (state) => {
      state.loading = true;
      state.total = null;
      state.error = null;
    });
    builder.addCase(
      adminGetTotalNumberOfOrders.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.total = payload;
        state.error = null;
      }
    );
    builder.addCase(
      adminGetTotalNumberOfOrders.rejected,
      (state, { payload }) => {
        state.loading = false;
        state.total = null;
        state.error = (payload as { error: string }).error;
      }
    );

    // get total delivered  orders
    builder.addCase(adminGetTotalDeliveredOrders.pending, (state) => {
      state.loading = true;
      state.totalDeliveredOrders = null;
      state.error = null;
    });
    builder.addCase(
      adminGetTotalDeliveredOrders.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.totalDeliveredOrders = payload;
        state.error = null;
      }
    );
    builder.addCase(
      adminGetTotalDeliveredOrders.rejected,
      (state, { payload }) => {
        state.loading = false;
        state.totalDeliveredOrders = null;
        state.error = (payload as { error: string }).error;
      }
    );

    builder.addCase(adminGetAllRecentOrders.pending, (state) => {
      state.loading = true;
      state.orders = state.orders;
      state.error = null;
    });
    builder.addCase(adminGetAllRecentOrders.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.orders = [...payload.orders];
    });
    builder.addCase(adminGetAllRecentOrders.rejected, (state, { payload }) => {
      state.loading = false;
      state.orders = state.orders;
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
