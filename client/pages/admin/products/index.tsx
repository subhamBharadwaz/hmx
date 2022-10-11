import React, { FormEvent, useEffect, useState } from "react";
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
  Menu,
  MenuItem,
  MenuButton,
  MenuOptionGroup,
  MenuList,
  MenuItemOption,
  MenuDivider,
  MenuItemOptionProps,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

import { AiFillEdit, AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";

import { AppDispatch, RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  getAllProducts,
} from "../../../store/services/admin/adminProductSlice";
import { IProduct } from "../../../types/product";
import { useRouter } from "next/router";
import { Select } from "chakra-react-select";
import Pagination from "../../../components/Pagination";

export default function Products() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, products, deleteSuccess } = useSelector(
    (state: RootState) => state.adminProductSlice
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
          <BreadcrumbLink as={Link} href="/admin">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Products</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Flex alignItems="center" justifyContent="space-between" mb={10}>
        <Text fontSize="3xl" fontWeight="semibold">
          Product List
        </Text>
        <Flex gap={5}>
          {/* //TODO filter */}
          <Link href="/admin/products/create">
            <Button
              fontSize={18}
              colorScheme="messenger"
              leftIcon={<AiOutlinePlus />}
            >
              Create new
            </Button>
          </Link>
        </Flex>
      </Flex>

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
          <SimpleGrid minChildWidth="250px" spacing={4}>
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
                    <Text>{`₹ ${product.price}`}</Text>
                    <HStack justifyContent="space-between">
                      <Link
                        href="/admin/products/[id]"
                        as={`/admin/products/${product._id}`}
                      >
                        <Button
                          leftIcon={<AiFillEdit />}
                          colorScheme="telegram"
                          variant="outline"
                        >
                          Edit
                        </Button>
                      </Link>
                      <Button
                        leftIcon={<AiFillDelete />}
                        colorScheme="red"
                        variant="outline"
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
