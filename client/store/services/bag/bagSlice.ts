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
      return rejectWithValue(err.response.data);
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
      return rejectWithValue(err.response.data);
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
      return rejectWithValue(err.response.data);
    }
  }
);

// empty bag
export const emptyBag = createAsyncThunk(
  "bag/emptybag",
  async (bagId: string, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/bag/emptybag/${bagId}`,

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

const bagSlice = createSlice({
  name: "bagActions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get all bag items
    builder.addCase(getBagItems.pending, (state) => {
      state.loading = true;
      state.bagData = null;
      state.error = null;
    });
    builder.addCase(getBagItems.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.bagData = { ...payload };
    });
    builder.addCase(getBagItems.rejected, (state, { payload }) => {
      state.loading = true;
      state.bagData = null;
      state.error = (payload as { error: string }).error;
    });

    // create and update bag items
    builder.addCase(createAndUpdateBagItems.pending, (state) => {
      state.loading = true;
      state.bagData = state.bagData;
      state.error = null;
    });
    builder.addCase(createAndUpdateBagItems.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.bagData = { ...payload };
    });
    builder.addCase(createAndUpdateBagItems.rejected, (state, { payload }) => {
      state.loading = true;
      state.bagData = state.bagData;
      state.error = (payload as { error: string }).error;
    });
    // delete bag item
    builder.addCase(deleteBagItem.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.bagData = state.bagData;
    });
    builder.addCase(deleteBagItem.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.bagData = { ...payload };
    });
    builder.addCase(deleteBagItem.rejected, (state, { payload }) => {
      state.loading = true;
      state.bagData = state.bagData;
      state.error = (payload as { error: string }).error;
    });
    // empty bag
    builder.addCase(emptyBag.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.bagData = state.bagData;
    });
    builder.addCase(emptyBag.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.bagData = null;
    });
    builder.addCase(emptyBag.rejected, (state, { payload }) => {
      state.loading = true;
      state.bagData = state.bagData;
      state.error = (payload as { error: string }).error;
    });
  },
});

export default bagSlice.reducer;
