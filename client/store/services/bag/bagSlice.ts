import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { IBag } from "../../../types/bag";

interface IBagData {
  loading: boolean;
  bagData: IBag;
  error: string | null;
}

const initialState = {
  loading: false,
  bagData: null,
  error: null,
} as IBagData;

// get all bag items
export const getBagItems = createAsyncThunk(
  "/bag",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/bag`,
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

// create and update bag items
export const createAndUpdateBagItems = createAsyncThunk(
  "bag/createAndUpdate",
  async (
    values: { productId: string; size: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/bag`,
        values,
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

// delete bag item
export const deleteBagItem = createAsyncThunk(
  "bag/delete",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/bag/${productId}`,

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

const bagSlice = createSlice({
  name: "bagActions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get all bag items
    builder.addCase(getBagItems.pending, (state) => {
      state.loading = true;
      state.bagData = null;
    });
    builder.addCase(getBagItems.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.error) {
        state.error = payload.error;
      }
      state.bagData = { ...payload };
    });
    builder.addCase(getBagItems.rejected, (state, payload) => {
      state.loading = true;
      state.bagData = null;
    });

    // create and update bag items
    builder.addCase(createAndUpdateBagItems.pending, (state) => {
      state.loading = true;
      state.bagData = state.bagData;
    });
    builder.addCase(createAndUpdateBagItems.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.error) {
        state.error = payload.error;
      }
      state.bagData = { ...payload };
    });
    builder.addCase(createAndUpdateBagItems.rejected, (state) => {
      state.loading = true;
      state.bagData = state.bagData;
    });
    // delete bag item
    builder.addCase(deleteBagItem.pending, (state) => {
      state.loading = true;

      state.bagData = state.bagData;
    });
    builder.addCase(deleteBagItem.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.error) {
        state.error = payload.error;
      }
      state.bagData = { ...payload };
    });
    builder.addCase(deleteBagItem.rejected, (state) => {
      state.loading = true;
      state.bagData = state.bagData;
    });
  },
});

export default bagSlice.reducer;
