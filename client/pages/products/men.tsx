import { Box, Flex, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import FilterProducts from "../../components/FilterProducts";
import FilteredProducts from "../../components/Product/FilteredProducts";
import { useSelector } from "react-redux";
import { RootState, wrapper } from "../../store";
import { getAllProducts } from "../../store/services/product/productSlice";

export default function MenProducts() {
  const { products, loading } = useSelector(
    (state: RootState) => state.productSlice
  );

  return (
    <Flex justifyContent="space-between">
      <Box w="20%">
        <FilterProducts loading={loading} productGender="Men" />
      </Box>
      <Box w="75%">
        {loading ? (
          <SimpleGrid columns={[2, null, 3]} spacingX="20px" spacingY="40px">
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
            <Skeleton height="400px" />
          </SimpleGrid>
        ) : products?.products.length !== 0 ? (
          <FilteredProducts products={products?.products} />
        ) : (
          <Flex alignItems="center" justifyContent="center" h="100%" w="100%">
            <Text fontSize="3xl" color="blackAlpha.500">
              Sorry, We couldn’t Find any matches!
            </Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await store.dispatch(getAllProducts({ gender: "Men" }));
    return {
      props: {},
    };
  }
);
