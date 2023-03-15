import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

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
  error: string | null;
}

const initialState = {
  loading: false,
  salesData: [],
  salesDataByState: [],
  error: null,
  message: null,
} as ISales;

// Get Admin sales data
export const adminGetSalesData = createAsyncThunk(
  "admin/sales",
  async (data: { year: string; month: string }, { rejectWithValue }) => {
    const { year, month } = data;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/sales/${year}/${month}`,
        {
          withCredentials: true,
        }
      );
      return await res.data.salesData;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Get Admin sales data by states
export const adminGetSalesDataByStates = createAsyncThunk(
  "admin/sales/state",
  async (
    { year = "", month = "" }: { year?: string; month?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/sales/state?year=${year}&month=${month}`,
        {
          withCredentials: true,
        }
      );
      return await res.data.salesData;
    } catch (err) {
      return rejectWithValue(err);
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
    });
    builder.addCase(adminGetSalesData.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.error) {
        state.error = payload.error;
      }
      state.salesData = [...payload];
    });
    builder.addCase(adminGetSalesData.rejected, (state) => {
      state.loading = false;
      state.salesData = [];
    });

    // get sales data by states
    builder.addCase(adminGetSalesDataByStates.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      adminGetSalesDataByStates.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        if (payload.error) {
          state.error = payload.error;
        }

        state.salesDataByState = [...payload];
      }
    );
    builder.addCase(adminGetSalesDataByStates.rejected, (state) => {
      state.loading = false;

      state.salesDataByState = [];
    });
  },
});

export default adminSalesSlice.reducer;
