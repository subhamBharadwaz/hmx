import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { IProduct } from "../../types/product";
import { Stack, shouldForwardProp, Skeleton, Box } from "@chakra-ui/react";

import FilterProducts from "../FilterProducts";
import SlideShow from "./SlideShow";
import Categories from "./Categories";
import TopSellingProducts from "./TopSellingProducts";
import withAuth from "../HOC/withAuth";

const Home = () => {
  const { loading, products } = useSelector(
    (state: RootState) => state.productSlice
  );

  return (
    <>
      <Box
        minH={["30vh", "30vh", "75vh"]}
        overflow="hidden"
        mt={[0, 0, "-5%"]}
        mb={[20, 20, 40]}
        w="100%"
        pos="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <SlideShow />
      </Box>
      <Box mb={[20, 20, 40]}>
        <Categories />
      </Box>

      <Box mb={[20, 20, 40]}>
        <TopSellingProducts />
      </Box>
    </>
  );
};
export default Home;
