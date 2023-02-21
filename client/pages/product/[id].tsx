import { useSelector } from "react-redux";
import SingleProduct from "../../components/Product/SingleProduct";
import { RootState, wrapper } from "../../store";
import { getSingleProduct } from "../../store/services/product/productSlice";
import {
  Box,
  SkeletonText,
  SkeletonCircle,
  Skeleton,
  Flex,
} from "@chakra-ui/react";

const Product = () => {
  const { loading, product } = useSelector(
    (state: RootState) => state.productSlice
  );

  return (
    <>
      {loading ? (
        <Box padding="6" boxShadow="lg" bg="white">
          <SkeletonCircle size="10" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
        </Box>
      ) : (
        <Box py="5%">
          <SingleProduct product={product} />
        </Box>
      )}
    </>
  );
};

export default Product;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, params }) => {
      const { id } = params;
      await store.dispatch(getSingleProduct(id));
      return {
        props: {},
      };
    }
);
