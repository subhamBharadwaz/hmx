import {
  Box,
  Flex,
  SimpleGrid,
  Skeleton,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import FilterProducts from "../../components/FilterProducts";
import FilteredProducts from "../../components/Product/FilteredProducts";
import { useSelector } from "react-redux";
import { RootState, wrapper } from "../../store";
import { getAllProducts } from "../../store/services/product/productSlice";
import NextLink from "next/link";
import FilterProductsMobile from "../../components/FilterProductsMobile";

export default function Products() {
  const { products, loading } = useSelector(
    (state: RootState) => state.productSlice
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          <BreadcrumbLink>Products</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex justifyContent="space-between">
        <Box w={250} mr={10} display={["none", "none", "block"]}>
          <FilterProducts
            loading={loading}
            productGender="All"
            productCategory="All"
            searchQuery={undefined}
          />
        </Box>
        <Box display={["block", "block", "none"]}>
          {" "}
          <Button onClick={onOpen}>Filter</Button>
          <FilterProductsMobile
            productCategory="All"
            productGender="All"
            searchQuery=""
            onClose={onClose}
            isOpen={isOpen}
            action={getAllProducts}
          />
        </Box>
        <Box w="75%" mx="auto">
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
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await store.dispatch(getAllProducts({ category: "All" }));
    return {
      props: {},
    };
  }
);
