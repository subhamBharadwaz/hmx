import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateProductInput, IProduct } from "../../../types/product";
import axios from "axios";

import { CookieValueTypes } from "cookies-next";

interface IProducts {
  loading: boolean;
  products: { products: IProduct[] };
  product: IProduct;
}

const initialState = {
  loading: false,
  products: {
    products: [],
  },
  product: {},
} as IProducts;

// get all products
export const getAllProducts = createAsyncThunk(
  "/products",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/products`,
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

// // get single product details with id
// export const getSingleProduct = createAsyncThunk(
//   "admin/product",
//   async (
//     data: { token: CookieValueTypes; id: string | string[] },
//     { rejectWithValue }
//   ) => {
//     const { token, id } = data;

//     try {
//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/admin/product/${id}`,
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return await res.data.product;
//     } catch (err) {
//       return rejectWithValue(err);
//     }
//   }
// );

const userProductSlice = createSlice({
  name: "userProductActions",
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
      state.products = { ...payload };
      state.product = null;
    });
    builder.addCase(getAllProducts.rejected, (state) => {
      state.loading = true;
      state.products = null;
      state.product = null;
    });
  },
});

export default userProductSlice.reducer;
