import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { IProduct } from "../../types/product";
import { Stack, shouldForwardProp, Skeleton } from "@chakra-ui/react";

import Carousel from "../Product/Carousel";

const Home = () => {
  const { loading, products } = useSelector(
    (state: RootState) => state.productSlice
  );

  return (
    <>
      {loading ? (
        <Stack>
          <Skeleton height="50px" /> <Skeleton height="50px" />{" "}
          <Skeleton height="50px" />
        </Stack>
      ) : (
        <Carousel />
      )}
    </>
  );
};
export default Home;
