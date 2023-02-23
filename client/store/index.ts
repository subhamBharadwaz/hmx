import {
  combineReducers,
  configureStore,
  ThunkAction,
  Action,
  AnyAction,
} from "@reduxjs/toolkit";
import auth from "./services/auth/auth-slice";
import adminUserSlice from "./services/admin/adminUserSlice";
import adminProductSlice from "./services/admin/adminProductSlice";
import productSlice from "./services/product/productSlice";
import bagSlice from "./services/bag/bagSlice";
import wishlistSlice from "./services/wishlist/wishlistSlice";
import { createWrapper, HYDRATE } from "next-redux-wrapper";

const combinedReducer = combineReducers({
  auth,
  adminUserSlice,
  adminProductSlice,
  productSlice,
  bagSlice,
  wishlistSlice,
});

const reducer = (
  state: ReturnType<typeof combinedReducer>,
  action: AnyAction
) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      adminUserSlice: {
        loading: state.adminUserSlice.loading,
        success: state.adminUserSlice.success,
        error: action.payload.adminUserSlice.error,
        users: {
          ...action.payload.adminUserSlice.users,
          ...state.adminUserSlice.users,
        },
        user: {
          ...action.payload.adminUserSlice.user,
          ...state.adminUserSlice.user,
        },
      },
      adminProductSlice: {
        loading: state.adminProductSlice.loading,
        createSuccess: state.adminProductSlice.createSuccess,
        updateSuccess: state.adminProductSlice.updateSuccess,
        deleteSuccess: state.adminProductSlice.deleteSuccess,
        error: action.payload.adminProductSlice.error,
        products: {
          ...action.payload.adminProductSlice.products,
          ...state.adminProductSlice.products,
        },
        product: {
          ...action.payload.adminProductSlice.product,
          ...state.adminProductSlice.product,
        },
      },
      productSlice: {
        loading: state.productSlice.loading,
        error: action.payload.productSlice.error,
        products: {
          ...action.payload.productSlice.products,
          ...state.productSlice.products,
        },
        product: {
          ...action.payload.productSlice.product,
          ...state.productSlice.product,
        },
      },
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export const makeStore = () =>
  configureStore({
    reducer,
  });

export type Store = ReturnType<typeof makeStore>;

export type AppDispatch = Store["dispatch"];
export type RootState = ReturnType<Store["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper(makeStore);
