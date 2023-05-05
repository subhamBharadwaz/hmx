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

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
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

  // Define an array of admin routes
  const adminRoutes = ["/admin", "/admin/dashboard", "/admin/products"];

  // Check if the current route is an admin route
  const isAdminRoute = adminRoutes.some((route) =>
    router.pathname.startsWith(route)
  );

  // Conditionally render the layout based on the current route
  const isAdminPage = router.pathname.startsWith("/admin");

  return (
    <ReactReduxContext.Consumer>
      {({ store }) => (
        // @ts-ignore
        <PersistGate persistor={store.__persistor} loading={null}>
          <ChakraProvider>
            {isAdminPage && isAuthenticated && user?.role === "admin" ? (
              <AdminLayout>
                <Component {...pageProps} />
              </AdminLayout>
            ) : (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            )}
          </ChakraProvider>
        </PersistGate>
      )}
    </ReactReduxContext.Consumer>
  );
}

export default wrapper.withRedux(MyApp);
