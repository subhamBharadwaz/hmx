import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { getAllProducts } from "../store/services/user/userProductSlice";

import Home from "../components/Home";
import { Box } from "@chakra-ui/react";

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);
  return (
    <Box mx="5%" my="10%">
      <Home />
    </Box>
  );
}
