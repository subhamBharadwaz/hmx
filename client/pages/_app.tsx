import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import AdminLayout from "../layout/AdminLayout";
import setAuthToken from "../utils/setAuthToken";
import { RootState, wrapper } from "../store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { userDetails } from "../store/services/auth/auth-slice";
import Layout from "../layout/Layout";
import { getBagItems } from "../store/services/bag/bagSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { getWishlistItems } from "../store/services/wishlist/wishlistSlice";

let tokenFromLocalStorage: string;
if (typeof window !== "undefined") {
  // Perform localStorage action
  tokenFromLocalStorage = localStorage.getItem("token");
}

if (tokenFromLocalStorage) {
  setAuthToken(tokenFromLocalStorage);
}

function MyApp({ Component, pageProps }: AppProps) {
  const { isAuthenticated, error } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(userDetails());

    dispatch(getBagItems());
    dispatch(getWishlistItems());
  }, [dispatch]);
  if (router.pathname.startsWith("/admin")) {
    return (
      <ChakraProvider>
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      </ChakraProvider>
    );
  }
  return (
    <ChakraProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
}

export default wrapper.withRedux(MyApp);
