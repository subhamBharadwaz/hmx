import {
  Box,
  Flex,
  SimpleGrid,
  Skeleton,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import FilterProducts from "../../components/FilterProducts";
import FilteredProducts from "../../components/Product/FilteredProducts";
import { useSelector } from "react-redux";
import { RootState, wrapper } from "../../store";
import { getAllProducts } from "../../store/services/product/productSlice";
import NextLink from "next/link";
import FilterProductsMobile from "../../components/FilterProductsMobile";
import { AiOutlineFilter } from "react-icons/ai";

export default function SearchedProducts({ q }) {
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
          <BreadcrumbLink>{q}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box display={["block", "block", "none"]} mb={5}>
        <Button
          colorScheme="messenger"
          variant="outline"
          onClick={onOpen}
          leftIcon={<AiOutlineFilter />}
        >
          Filter
        </Button>
        <FilterProductsMobile
          productCategory="All"
          productGender="Men"
          searchQuery=""
          onClose={onClose}
          isOpen={isOpen}
          action={getAllProducts}
        />
      </Box>
      <Flex justifyContent="space-between">
        <Box w={250} mr={10} display={["none", "none", "block"]}>
          <FilterProducts
            searchQuery={q}
            loading={loading}
            productGender="All"
            productCategory={undefined}
          />
        </Box>

        <Box w={["100%", "100%", "75%"]} mx="auto">
          <Text
            fontSize="xl"
            fontWeight="semibold"
            color="blackAlpha.700"
            mb={10}
          >
            Showing results for {q}{" "}
            {/* <Text color="blackAlpha.500" display="inline-block">
            {products?.total} item(s)
          </Text> */}
          </Text>
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
            <FilteredProducts
              total={products?.total}
              search={q}
              products={products?.products}
            />
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
  (store) =>
    async ({ req, res, query }) => {
      const { q } = query;
      console.log(query);
      await store.dispatch(getAllProducts({ search: q }));
      return {
        props: {
          q,
        },
      };
    }
);
