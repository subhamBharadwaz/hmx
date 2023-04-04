import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateAddressInput, IAddress } from "../../../types/address";

const address =
  typeof window !== "undefined" && localStorage.getItem("shippingAddress")
    ? JSON.parse(localStorage.getItem("shippingAddress"))
    : null;

interface AddressState {
  shippingAddress: CreateAddressInput;
}
const initialState = {
  shippingAddress: null,
} as AddressState;

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    getShippingAddress: (state) => {
      state.shippingAddress = address ? address : null;
    },
    createShippingAddress: (
      state,
      action: PayloadAction<CreateAddressInput>
    ) => {
      state.shippingAddress = action.payload;
      localStorage.setItem(
        "shippingAddress",
        JSON.stringify(state.shippingAddress)
      );
    },
    removeShippingAddress: (state) => {
      state.shippingAddress = null;
      localStorage.removeItem("shippingAddress");
    },
  },
});

export const {
  getShippingAddress,
  createShippingAddress,
  removeShippingAddress,
} = addressSlice.actions;

export default addressSlice.reducer;
