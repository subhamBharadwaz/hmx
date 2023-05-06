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
import adminOrderSlice from "./services/admin/adminOrderSlice";
import adminSalesSlice from "./services/admin/adminSalesSlice";
import productSlice from "./services/product/productSlice";
import reviewSlice from "./services/review/reviewSlice";
import bagSlice from "./services/bag/bagSlice";
import wishlistSlice from "./services/wishlist/wishlistSlice";
import addressSlice from "./services/address/addressSlice";
import checkoutSlice from "./services/checkout/checkoutSlice";
import orderSlice from "./services/order/orderSlice";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { persistStore, persistReducer } from "redux-persist";
const storage = require("redux-persist/lib/storage").default;

const SET_CLIENT_STATE = HYDRATE;

const combinedReducer = combineReducers({
  auth,
  adminUserSlice,
  adminProductSlice,
  adminOrderSlice,
  adminSalesSlice,
  productSlice,
  reviewSlice,
  bagSlice,
  wishlistSlice,
  addressSlice,
  checkoutSlice,
  orderSlice,
});

export const reducer = (
  state: ReturnType<typeof combinedReducer>,
  action: AnyAction
) => {
  if (action.type === SET_CLIENT_STATE) {
    const nextState = {
      ...state,
      auth: {
        loading: state.auth.loading,
        token: state.auth.token,
        error: action.payload.auth.error,
        isAuthenticated: state.auth.isAuthenticated,
        user: {
          ...state.auth.user,
          ...action.payload.auth.user,
        },
      },
      adminUserSlice: {
        loading: state.adminUserSlice.loading,
        error: action.payload.adminUserSlice.error,
        users: {
          ...state.adminUserSlice.users,
          ...action.payload.adminUserSlice.users,
        },
        user: {
          ...state.adminUserSlice.user,
          ...action.payload.adminUserSlice.user,
        },
      },
      adminProductSlice: {
        loading: state.adminProductSlice.loading,
        error: action.payload.adminProductSlice.error,
        total: action.payload.adminProductSlice.total,
        products: {
          ...state.adminProductSlice.products,
          ...action.payload.adminProductSlice.products,
        },
        product: {
          ...state.adminProductSlice.product,
          ...action.payload.adminProductSlice.product,
        },
      },
      adminOrderSlice: {
        loading: state.adminOrderSlice.loading,
        message: action.payload.adminOrderSlice.message,
        error: action.payload.adminOrderSlice.error,
        total: action.payload.adminOrderSlice.total,
        totalDeliveredOrders:
          action.payload.adminOrderSlice.totalDeliveredOrders,
        orders: [
          ...state.adminOrderSlice.orders,
          ...action.payload.adminOrderSlice.orders,
        ],
        order: {
          ...state.adminOrderSlice.order,
          ...action.payload.adminOrderSlice.order,
        },
      },
      adminSalesSlice: {
        loading: state.adminSalesSlice.loading,
        error: action.payload.adminSalesSlice.error,
        totalRevenue: action.payload.adminSalesSlice.totalRevenue,
        salesData: [
          ...state.adminSalesSlice.salesData,
          ...action.payload.adminSalesSlice.salesData,
        ],
        salesDataByState: [
          ...state.adminSalesSlice.salesDataByState,
          ...action.payload.adminSalesSlice.salesDataByState,
        ],
      },
      productSlice: {
        loading: state.productSlice.loading,
        error: action.payload.productSlice.error,
        products: {
          ...state.productSlice.products,
          ...action.payload.productSlice.products,
        },
        topSellingProducts: [
          ...state.productSlice.topSellingProducts,
          ...action.payload.productSlice.topSellingProducts,
        ],
        product: {
          ...state.productSlice.product,
          ...action.payload.productSlice.product,
        },
      },
      orderSlice: {
        loading: state.orderSlice.loading,
        error: action.payload.orderSlice.error,
        orders: [
          ...state.orderSlice.orders,
          ...action.payload.orderSlice.orders,
        ],
        order: {
          ...state.orderSlice.order,
          ...action.payload.orderSlice.order,
        },
      },
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

const makeConfiguredStore = (reducer) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
  });

const makeStore = () => {
  const isServer = typeof window === "undefined";

  if (isServer) {
    return makeConfiguredStore(reducer);
  } else {
    // we need it only on client side
    const persistConfig = {
      key: "hmx",
      whitelist: ["auth"], // make sure it does not clash with server keys
      storage,
    };

    const persistedReducer = persistReducer(persistConfig, reducer);
    const store = makeConfiguredStore(persistedReducer);
    // @ts-ignore
    store.__persistor = persistStore(store); // Nasty hack

    return store;
  }
};

export type Store = ReturnType<typeof makeStore>;

export type AppDispatch = Store["dispatch"];
export type RootState = ReturnType<typeof combinedReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper(makeStore);

export const setClientState = (clientState) => ({
  type: SET_CLIENT_STATE,
  payload: clientState,
});
