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
import PrivateRoute from "../components/PrivateRoute";
import { getWishlistItems } from "../store/services/wishlist/wishlistSlice";
import { IAddress } from "../types/address";
import { getShippingAddress } from "../store/services/address/addressSlice";

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

  const protectedRoutes = [
    "/admin",
    "/admin/dashboard",
    "/admin/products",
    "/admin/products/[id]",
    "/admin/products/create",
    "/admin/users",
    "/admin/users/[id]",
  ];
  if (router.pathname.startsWith("/admin")) {
    return (
      <ChakraProvider>
        <PrivateRoute protectedRoutes={protectedRoutes}>
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
        </PrivateRoute>
      </ChakraProvider>
    );
  }
  return (
    <ChakraProvider>
      <PrivateRoute protectedRoutes={protectedRoutes}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PrivateRoute>
    </ChakraProvider>
  );
}

export default wrapper.withRedux(MyApp);
