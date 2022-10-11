import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import "../styles/globals.css";
import AdminLayout from "../layout/AdminLayout";
import setAuthToken from "../utils/setAuthToken";
import { wrapper } from "../store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { userDetails } from "../store/services/auth/auth-slice";

let tokenFromLocalStorage: string;
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
  useEffect(() => {
    dispatch(userDetails());
  }, []);
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
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default wrapper.withRedux(MyApp);
