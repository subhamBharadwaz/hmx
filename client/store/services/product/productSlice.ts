import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateProductInput, IProduct } from "../../../types/product";
import axios from "axios";

import { CookieValueTypes } from "cookies-next";

interface IProducts {
  loading: boolean;
  products: { products: IProduct[] };
  product: IProduct;
  error: string | null;
}

const initialState = {
  loading: false,
  products: {
    products: [],
  },
  product: {},
  error: null,
} as IProducts;

// get all products
export const getAllProducts = createAsyncThunk(
  "/products",
  async (
    data: {
      category?: string | string[];
      gender?: string | string[];
      size?: string | string[];
      page?: number;
      limit?: number;
      search?: string | string[];
    },
    { rejectWithValue }
  ) => {
    const { category, gender, size, page, limit, search } = data;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/products?page=${
          page || 1
        }&limit=${limit}&category=${category || "All"}&gender=${
          gender || "All"
        }&size=${size || "All"}&search=${search || ""}`,
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

// get single product details with id
export const getSingleProduct = createAsyncThunk(
  "/product/id",
  async (id: string | string[], { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/product/${id}`,
        {
          withCredentials: true,
        }
      );
      return await res.data.product;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const productSlice = createSlice({
  name: "userProductActions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // all products
    builder.addCase(getAllProducts.pending, (state) => {
      state.loading = true;
      state.products = null;
      state.product = state.product;
    });
    builder.addCase(getAllProducts.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.error) {
        state.error = payload.error;
      }
      state.products = payload;
      state.product = state.product;
    });
    builder.addCase(getAllProducts.rejected, (state) => {
      state.loading = true;
      state.products = null;
      state.product = state.product;
    });

    // single product
    builder.addCase(getSingleProduct.pending, (state) => {
      state.loading = true;
      state.products = state.products;
      state.product = null;
    });
    builder.addCase(getSingleProduct.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.products = state.products;
      state.product = { ...payload };
    });
    builder.addCase(getSingleProduct.rejected, (state) => {
      state.loading = true;
      state.products = state.products;
      state.product = null;
    });
  },
});

export default productSlice.reducer;
