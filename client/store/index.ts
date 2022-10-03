import {
  combineReducers,
  configureStore,
  ThunkAction,
  Action,
  AnyAction,
} from "@reduxjs/toolkit";
import auth from "./services/auth/auth-slice";
import adminUserActions from "./services/admin/adminUserSlice";
import { createWrapper, HYDRATE } from "next-redux-wrapper";

const combinedReducer = combineReducers({
  auth,
  adminUserActions,
});

const reducer = (
  state: ReturnType<typeof combinedReducer>,
  action: AnyAction
) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      auth: {
        token: state.auth.token,
        isAuthenticated: state.auth.isAuthenticated,
        loading: state.auth.loading,
      },
      adminUserActions: {
        loading: state.adminUserActions.loading,
        users: [
          ...action.payload.adminUserActions.users,
          ...state.adminUserActions.users,
        ],
        user: {
          ...action.payload.adminUserActions.user,
          ...state.adminUserActions.user,
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
