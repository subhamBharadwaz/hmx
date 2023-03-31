import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateProductInput, IProduct } from "../../../types/product";
import axios from "axios";

import { CookieValueTypes } from "cookies-next";

interface IProducts {
  loading: boolean;
  products: { products: IProduct[] };
  product: IProduct;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  error: string | null;
}

const initialState = {
  loading: false,
  products: {
    products: [],
  },
  product: {},
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
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
    { rejectWithValue }
  ) => {
    try {
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
          withCredentials: true,
        }
      );
      return await res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllFilteredProducts = createAsyncThunk(
  "admin/products/filtered",
  async (query: { section: string; size: string }, { rejectWithValue }) => {
    const { section, size } = query;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/products?section=${section}&size=${size}`,
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
  "admin/product",
  async (
    data: { token: CookieValueTypes; id: string | string[] },
    { rejectWithValue }
  ) => {
    const { token, id } = data;

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/product/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return await res.data.product;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// add a new product
export const createProduct = createAsyncThunk(
  "admin/product/create",
  async (values: CreateProductInput, { rejectWithValue }) => {
    try {
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
          },
        }
      );
      return await res.data.product;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// admin update single product
export const updateProduct = createAsyncThunk(
  "admin/product/update",
  async (
    data: { values: CreateProductInput; id: string | string[] },
    { rejectWithValue }
  ) => {
    const { values, id } = data;
    try {
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
          },
        }
      );
      return await res.data.product;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// admin delete single product
export const deleteProduct = createAsyncThunk(
  "admin/product/delete",
  async (id: string | string[], { rejectWithValue }) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/product/${id}`,

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
    });
    builder.addCase(getAllProducts.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.error) {
        state.error = payload.error;
      }
      state.products = { ...payload };
      state.product = null;
    });
    builder.addCase(getAllProducts.rejected, (state) => {
      state.loading = true;
      state.products = null;
      state.product = null;
    });

    // filtered products
    builder.addCase(getAllFilteredProducts.pending, (state) => {
      state.loading = true;
      state.products = null;
      state.product = null;
    });
    builder.addCase(getAllFilteredProducts.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.error) {
        state.error = payload.error;
      }
      state.products = { ...payload };
      state.product = null;
    });
    builder.addCase(getAllFilteredProducts.rejected, (state) => {
      state.loading = true;
      state.products = null;
      state.product = null;
    });

    // single product
    builder.addCase(getSingleProduct.pending, (state) => {
      state.loading = true;
      state.products = state.products;
      state.product = null;
      state.updateSuccess = false;
    });
    builder.addCase(getSingleProduct.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.error) {
        state.error = payload.error;
      }
      state.updateSuccess = false;

      state.products = state.products;
      state.product = { ...payload };
    });
    builder.addCase(getSingleProduct.rejected, (state) => {
      state.loading = true;
      state.products = state.products;
      state.updateSuccess = false;

      state.product = null;
    });

    // create product
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.products = state.products;
      state.product = state.product;
      state.createSuccess = false;
    });
    builder.addCase(createProduct.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (payload.error) {
        state.error = payload.error;
      }
      state.products = state.products;
      state.product = { ...payload };
      state.createSuccess = true;
    });
    builder.addCase(createProduct.rejected, (state) => {
      state.loading = true;
      state.products = state.products;
      state.product = null;
      state.createSuccess = false;
    });

    // update product
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.products = state.products;
      state.product = state.product;
      state.updateSuccess = false;
    });
    builder.addCase(updateProduct.fulfilled, (state, { payload }) => {
      state.loading = false;

      state.products.products = state.products.products.map((product) =>
        product._id === payload.id ? payload : product
      );
      state.product = payload;
      state.updateSuccess = true;
    });
    builder.addCase(updateProduct.rejected, (state) => {
      state.loading = true;
      state.products = state.products;
      state.product = state.product;
      state.updateSuccess = false;
    });

    // delete product
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.products = state.products;

      state.deleteSuccess = false;
    });
    builder.addCase(deleteProduct.fulfilled, (state, { payload }) => {
      state.loading = false;
      // @ts-ignore
      if (payload.error) {
        // @ts-ignore

        state.error = payload.error;
      }
      state.products.products = state.products.products.filter(
        (product) => product._id !== payload
      );
      state.deleteSuccess = true;
    });
    builder.addCase(deleteProduct.rejected, (state) => {
      state.loading = true;
      state.products = state.products;

      state.deleteSuccess = false;
    });
  },
});

export default adminProductSlice.reducer;
