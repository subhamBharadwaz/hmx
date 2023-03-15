import { useEffect } from "react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import AdminLayout from "../layout/AdminLayout";
import setAuthToken from "../utils/setAuthToken";
import { RootState, wrapper } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { userDetails } from "../store/services/auth/auth-slice";
import Layout from "../layout/Layout";
import { getBagItems } from "../store/services/bag/bagSlice";
import PrivateRoute from "../components/HOC/withAuth";
import { getWishlistItems } from "../store/services/wishlist/wishlistSlice";
import { IAddress } from "../types/address";
import { getShippingAddress } from "../store/services/address/addressSlice";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { ReactReduxContext } from "react-redux";
let tokenFromLocalStorage: string;
let shippingAddress;
if (typeof window !== "undefined") {
  // Perform localStorage action
  tokenFromLocalStorage = localStorage.getItem("token");
}

if (tokenFromLocalStorage) {
  setAuthToken(tokenFromLocalStorage);
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    dispatch(userDetails());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getBagItems());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getWishlistItems());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getShippingAddress());
  }, [dispatch]);

  return (
    <ReactReduxContext.Consumer>
      {({ store }) => (
        // @ts-ignore
        <PersistGate persistor={store.__persistor} loading={null}>
          <ChakraProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ChakraProvider>
        </PersistGate>
      )}
    </ReactReduxContext.Consumer>
  );
}

export default wrapper.withRedux(MyApp);
