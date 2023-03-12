import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { IProduct } from "../../types/product";
import { Stack, shouldForwardProp, Skeleton, Box } from "@chakra-ui/react";

import Carousel from "../Product/Carousel";
import FilterProducts from "../FilterProducts";
import SlideShow from "./SlideShow";
import Categories from "./Categories";

const Home = () => {
  const { loading, products } = useSelector(
    (state: RootState) => state.productSlice
  );

  return (
    <>
      <Box
        h={["20vh", "50vh", "70vh"]}
        mt="-5%"
        mb={40}
        w="100%"
        pos="relative"
        overflow="hidden"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <SlideShow />
      </Box>
      <Categories />
    </>
  );
};
export default Home;
