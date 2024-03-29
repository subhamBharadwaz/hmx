import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import { RootState } from "../../index";

interface ISales {
  loading: boolean;
  salesData: {
    totalRevenue: number;
    yearMonth: string;
  }[];
  salesDataByState: {
    _id: string;
    totalRevenue: number;
  }[];
  totalRevenue: number;
  error: string | null;
}

const initialState = {
  loading: false,
  salesData: [],
  salesDataByState: [],
  error: null,
  totalRevenue: null,
} as ISales;

// Get Admin sales data
export const adminGetSalesData = createAsyncThunk(
  "admin/sales",
  async (
    data: { year: string; month: string },
    { getState, rejectWithValue }
  ) => {
    const { token } = (getState() as RootState).auth;
    const { year, month } = data;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/sales/${year}/${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          withCredentials: true,
        }
      );
      return await res.data.salesData;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Get Admin sales data by states
export const adminGetSalesDataByStates = createAsyncThunk(
  "admin/sales/state",
  async (
    { year = "", month = "" }: { year?: string; month?: string },
    { getState, rejectWithValue }
  ) => {
    const { token } = (getState() as RootState).auth;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/sales/state?year=${year}&month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return await res.data.salesData;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Get Admin total revenue
export const adminGetTotalRevenue = createAsyncThunk(
  "admin/sales/total",
  async (_, { getState, rejectWithValue }) => {
    const { token } = (getState() as RootState).auth;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/sales/total`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return await res.data.totalRevenue;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const adminSalesSlice = createSlice({
  name: "adminSalesActions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get sales data
    builder.addCase(adminGetSalesData.pending, (state) => {
      state.loading = true;
      state.salesData = [];
      state.error = null;
    });
    builder.addCase(adminGetSalesData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.salesData = [...payload];
    });
    builder.addCase(adminGetSalesData.rejected, (state, { payload }) => {
      state.loading = false;
      state.salesData = [];
      state.error = (payload as { error: string }).error;
    });

    // get sales data by states
    builder.addCase(adminGetSalesDataByStates.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      adminGetSalesDataByStates.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.error = null;

        state.salesDataByState = [...payload];
      }
    );
    builder.addCase(
      adminGetSalesDataByStates.rejected,
      (state, { payload }) => {
        state.loading = false;
        state.error = (payload as { error: string }).error;
        state.salesDataByState = [];
      }
    );

    // get total revenue
    builder.addCase(adminGetTotalRevenue.pending, (state) => {
      state.loading = true;
      state.totalRevenue = null;
      state.error = null;
    });
    builder.addCase(adminGetTotalRevenue.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.totalRevenue = payload;
    });
    builder.addCase(adminGetTotalRevenue.rejected, (state, { payload }) => {
      state.loading = false;
      state.totalRevenue = null;
      state.error = (payload as { error: string }).error;
    });
  },
});

export default adminSalesSlice.reducer;
