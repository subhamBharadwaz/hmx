import {
  Box,
  Flex,
  SimpleGrid,
  Skeleton,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import FilterProducts from "../../components/FilterProducts";
import FilteredProducts from "../../components/Product/FilteredProducts";
import { useSelector } from "react-redux";
import { RootState, wrapper } from "../../store";
import { getAllProducts } from "../../store/services/product/productSlice";
import NextLink from "next/link";

export default function WomenProducts() {
  const { products, loading } = useSelector(
    (state: RootState) => state.productSlice
  );

  return (
    <>
      <Breadcrumb
        fontWeight="medium"
        fontSize="md"
        mb={10}
        color="blackAlpha.600"
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={NextLink} href="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Women</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex justifyContent="space-between">
        <Box w="20%">
          <FilterProducts
            loading={loading}
            productGender="Women"
            productCategory={undefined}
            searchQuery={undefined}
          />
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
          ) : products?.products?.length !== 0 ? (
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
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await store.dispatch(getAllProducts({ gender: "Women" }));
    return {
      props: {},
    };
  }
);
