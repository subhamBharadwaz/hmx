import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateProductInput, IProduct } from "../../../types/product";
import axios from "axios";

import { CookieValueTypes } from "cookies-next";

interface ITopSellingProps {
  quantitySold: number;
  totalRevenue: number;
  productId: string;
  name: string;
  photos: {
    id: string;
    secure_url: string;
  }[];
  price: string;
  category: string;
}

interface IProducts {
  loading: boolean;
  products: { products: IProduct[]; total: number };
  topSellingProducts: ITopSellingProps[];
  product: IProduct;
  error: string | null;
}

const initialState = {
  loading: false,
  products: {
    products: [],
  },
  topSellingProducts: [],
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
      page?: string;
      limit?: string;
      minPrice?: number;
      maxPrice?: number;
      sortDirection?: string;
      sortBy?: string;
      search?: string | string[];
    },
    { rejectWithValue }
  ) => {
    const {
      category,
      gender,
      size,
      page,
      limit,
      search,
      minPrice,
      maxPrice,
      sortDirection,
      sortBy,
    } = data;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/products?page=${
          page || "1"
        }&limit=${limit || 12}&category=${category || "All"}&gender=${
          gender || "All"
        }&size=${size || "All"}&minPrice=${minPrice || 499}&maxPrice=${
          maxPrice || 3999
        }&sortDirection=${sortDirection}&sortBy=${sortBy || "price"}&search=${
          search || ""
        }`,
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

// get similar products
export const getSimilarProducts = createAsyncThunk(
  "/products/similarProducts",
  async (category: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/products?category=${category}`,
        {
          withCredentials: true,
        }
      );
      return await res.data.products;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// get top-selling products
export const getTopSellingProducts = createAsyncThunk(
  "/products/top-selling",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/top-selling`,
        {
          withCredentials: true,
        }
      );

      return await res.data.products;
    } catch (err) {
      return rejectWithValue(err.response.data);
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
      return rejectWithValue(err.response.data);
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
      state.error = null;
    });
    builder.addCase(getAllProducts.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.products = payload;
      state.product = state.product;
    });
    builder.addCase(getAllProducts.rejected, (state, { payload }) => {
      state.loading = true;
      state.products = null;
      state.product = state.product;
      state.error = (payload as { error: string }).error;
    });

    // get similar products
    builder.addCase(getSimilarProducts.pending, (state) => {
      state.loading = true;
      state.products = null;
      state.product = state.product;
      state.error = null;
    });
    builder.addCase(getSimilarProducts.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.products = payload;
      state.product = state.product;
    });
    builder.addCase(getSimilarProducts.rejected, (state, { payload }) => {
      state.loading = true;
      state.products = null;
      state.product = state.product;
      state.error = (payload as { error: string }).error;
    });

    // top selling products
    builder.addCase(getTopSellingProducts.pending, (state) => {
      state.loading = true;
      state.topSellingProducts = [];
      state.error = null;
    });
    builder.addCase(getTopSellingProducts.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.error = null;
      state.topSellingProducts = [...payload];
    });
    builder.addCase(getTopSellingProducts.rejected, (state, { payload }) => {
      state.loading = true;
      state.products = null;
      state.topSellingProducts = [];
      state.error = (payload as { error: string }).error;
    });

    // single product
    builder.addCase(getSingleProduct.pending, (state) => {
      state.loading = true;
      state.products = state.products;
      state.error = null;
      state.product = null;
    });
    builder.addCase(getSingleProduct.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.products = state.products;
      state.error = null;
      state.product = { ...payload };
    });
    builder.addCase(getSingleProduct.rejected, (state, { payload }) => {
      state.loading = true;
      state.products = state.products;
      state.product = null;
      state.error = (payload as { error: string }).error;
    });
  },
});

export default productSlice.reducer;
