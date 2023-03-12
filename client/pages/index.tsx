import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { getAllProducts } from "../store/services/product/productSlice";

import Home from "../components/Home";
import { Box } from "@chakra-ui/react";
import { userDetails } from "../store/services/auth/auth-slice";

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(userDetails());
  }, [dispatch]);

  return (
    <Box my="5%">
      <Home />
    </Box>
  );
}
