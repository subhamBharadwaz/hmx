import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateProductInput, IProduct } from "../../../types/product";
import axios from "axios";

import { CookieValueTypes } from "cookies-next";
import { RootState } from "../../index";

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
  "admin/products",
  async (
    data: {
      category?: string | string[];
      gender?: string | string[];
      size?: string | string[];
      page?: string;
      limit?: string;
      search?: string | string[];
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const { token } = (getState() as RootState).auth;
      const { category, gender, size, page, limit, search } = data;

      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER_ENDPOINT
        }/api/v1/admin/products?page=${page}&limit=${limit || "10"}&category=${
          category || "All"
        }&gender=${gender || "All"}&size=${size || "All"}&search=${
          search || ""
        }`,
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

export const getAllFilteredProducts = createAsyncThunk(
  "admin/products/filtered",
  async (
    query: { section: string; size: string },
    { getState, rejectWithValue }
  ) => {
    const { section, size } = query;
    try {
      const { token } = (getState() as RootState).auth;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/products?section=${section}&size=${size}`,
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

// get single product details with id
export const getSingleProduct = createAsyncThunk(
  "admin/product",
  async (data: { id: string | string[] }, { getState, rejectWithValue }) => {
    const { id } = data;

    try {
      const { token } = (getState() as RootState).auth;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return await res.data.product;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// add a new product
export const createProduct = createAsyncThunk(
  "admin/product/create",
  async (values: CreateProductInput, { getState, rejectWithValue }) => {
    try {
      const { token } = (getState() as RootState).auth;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/product/add`,
        values,
        {
          // Todo
          onUploadProgress: (progress) => {
            const { loaded, total } = progress;
            let percent = Math.floor((loaded * 100) / total);
          },
          withCredentials: true,
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return await res.data.product;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// admin update single product
export const updateProduct = createAsyncThunk(
  "admin/product/update",
  async (
    data: { values: CreateProductInput; id: string | string[] },
    { getState, rejectWithValue }
  ) => {
    const { values, id } = data;
    try {
      const { token } = (getState() as RootState).auth;
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/product/${id}`,
        values,
        {
          // Todo
          onUploadProgress: (progress) => {
            const { loaded, total } = progress;
            let percent = Math.floor((loaded * 100) / total);
          },
          withCredentials: true,
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return await res.data.product;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// admin delete single product
export const deleteProduct = createAsyncThunk(
  "admin/product/delete",
  async (id: string | string[], { getState, rejectWithValue }) => {
    try {
      const { token } = (getState() as RootState).auth;
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/product/${id}`,

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

const adminProductSlice = createSlice({
  name: "adminProductActions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // all products
    builder.addCase(getAllProducts.pending, (state) => {
      state.loading = true;
      state.products = null;
      state.product = null;
      state.error = null;
    });
    builder.addCase(getAllProducts.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.products = { ...payload };
      state.product = null;
    });
    builder.addCase(getAllProducts.rejected, (state, { payload }) => {
      state.loading = true;
      state.products = null;
      state.product = null;
      state.error = (payload as { error: string }).error;
    });

    // filtered products
    builder.addCase(getAllFilteredProducts.pending, (state) => {
      state.loading = true;
      state.products = null;
      state.product = null;
      state.error = null;
    });
    builder.addCase(getAllFilteredProducts.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.products = { ...payload };
      state.product = null;
    });
    builder.addCase(getAllFilteredProducts.rejected, (state, { payload }) => {
      state.loading = true;
      state.products = null;
      state.product = null;
      state.error = (payload as { error: string }).error;
    });

    // single product
    builder.addCase(getSingleProduct.pending, (state) => {
      state.loading = true;
      state.products = state.products;
      state.product = null;
      state.error = null;
    });
    builder.addCase(getSingleProduct.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.products = state.products;
      state.product = { ...payload };
    });
    builder.addCase(getSingleProduct.rejected, (state, { payload }) => {
      state.loading = true;
      state.products = state.products;
      state.error = (payload as { error: string }).error;
      state.product = null;
    });

    // create product
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.products = state.products;
      state.product = state.product;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, { payload }) => {
      state.loading = false;

      state.error = null;

      state.products = state.products;
      state.product = { ...payload };
    });
    builder.addCase(createProduct.rejected, (state, payload) => {
      state.loading = true;
      state.products = state.products;
      state.product = null;
      state.error = (payload as unknown as { error: string }).error;
    });

    // update product
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.products = state.products;
      state.product = state.product;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, { payload }) => {
      state.loading = false;

      state.products.products = state.products.products.map((product) =>
        product._id === payload.id ? payload : product
      );
      state.product = payload;
    });
    builder.addCase(updateProduct.rejected, (state, { payload }) => {
      state.loading = true;
      state.products = state.products;
      state.product = state.product;
      state.error = (payload as { error: string }).error;
    });

    // delete product
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.products = state.products;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.products.products = state.products.products.filter(
        (product) => product._id !== payload
      );
    });
    builder.addCase(deleteProduct.rejected, (state, { payload }) => {
      state.loading = true;
      state.products = state.products;

      state.error = (payload as { error: string }).error;
    });
  },
});

export default adminProductSlice.reducer;
