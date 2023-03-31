import { useEffect } from "react";
import {
  Box,
  Button,
  SimpleGrid,
  Spinner,
  HStack,
  Text,
  Stack,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";

import { AiFillEdit, AiFillDelete, AiOutlinePlus } from "react-icons/ai";

import { AppDispatch, RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  getAllProducts,
} from "../../../store/services/admin/adminProductSlice";
import { IProduct } from "../../../types/product";
import { useRouter } from "next/router";
import Pagination from "../../../components/Pagination";
import withAuth from "../../../components/HOC/withAuth";

import FilterProducts from "../../../components/admin/product/FilterProducts";

function Products() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, products, deleteSuccess, error } = useSelector(
    (state: RootState) => state.adminProductSlice
  );
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // toast
  const toast = useToast();

  useEffect(() => {
    if (deleteSuccess) {
      toast({
        title: "Product deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [deleteSuccess, toast]);
  return (
    <Box>
      <Breadcrumb
        fontWeight="medium"
        fontSize="md"
        my={4}
        color="blackAlpha.600"
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={NextLink} href="/admin">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Products</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Flex alignItems="center" justifyContent="space-between" mb={3}>
        <Text fontSize={["xl", "xl", "3xl"]} fontWeight="semibold">
          Product List
        </Text>

        <Flex gap={5}>
          <NextLink href="/admin/products/create">
            <Button
              size={["sm", "sm", "md"]}
              colorScheme="messenger"
              leftIcon={<AiOutlinePlus />}
            >
              Create new
            </Button>
          </NextLink>
        </Flex>
      </Flex>
      <Box mb={6}>
        <Stack alignItems="center" spacing={[2, 2, 5]}>
          <Text fontSize={16} fontWeight="semibold" alignSelf="flex-start">
            Filter by
          </Text>
          <Box alignSelf="flex-start">
            <FilterProducts
              productCategory="All"
              productGender="All"
              searchQuery=""
            />
          </Box>
        </Stack>
      </Box>
      {loading ? (
        <Flex align="center" justifyContent="center">
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
          />
        </Flex>
      ) : (
        <Box
          p={4}
          maxH="100%"
          boxShadow="0 4px 12px rgba(0,0,0,0.05)"
          position="relative"
        >
          <SimpleGrid minChildWidth="200px" spacing={4}>
            {products.products &&
              products.products.map((product: IProduct) => (
                <Box key={product._id} p={2}>
                  <Stack>
                    <Image
                      alt={product.name}
                      src={product.photos[0].secure_url}
                      height={500}
                      width={400}
                      objectFit="cover"
                    />

                    <Text fontWeight="semibold">{product.name}</Text>
                    <Text color="blackAlpha.600">{product.category}</Text>
                    <Text fontWeight="semibold">{`₹ ${product.price}`}</Text>
                    <HStack justifyContent="space-between">
                      <NextLink
                        href="/admin/products/[id]"
                        as={`/admin/products/${product._id}`}
                      >
                        <Button
                          leftIcon={<AiFillEdit />}
                          colorScheme="blue"
                          variant="outline"
                          size="sm"
                        >
                          Edit
                        </Button>
                      </NextLink>
                      <Button
                        leftIcon={<AiFillDelete />}
                        colorScheme="red"
                        variant="outline"
                        size="sm"
                        onClick={() => dispatch(deleteProduct(product._id))}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Stack>
                </Box>
              ))}
          </SimpleGrid>
        </Box>
      )}

      <Pagination data={products} action={getAllProducts} />
    </Box>
  );
}

export default withAuth(Products);
