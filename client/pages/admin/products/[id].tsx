import React, { useEffect } from "react";

import { useSelector } from "react-redux";
import { RootState, wrapper } from "../../../store";

import { getCookie } from "cookies-next";

interface IProductSize {
  value: string;
  label: string;
}

import {
  Box,
  SkeletonCircle,
  SkeletonText,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";

import { getSingleProduct } from "../../../store/services/admin/adminProductSlice";
import Link from "next/link";
import UpdateProductDetails from "../../../components/admin/product/UpdateProductDetails";

export default function SingleProductDetails() {
  const { loading, product } = useSelector(
    (state: RootState) => state.adminProductSlice
  );

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

        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/admin/products">
            Products
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Edit</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      {loading ? (
        <Box mx="auto" w="65%" padding="6" boxShadow="sm" bg="white">
          <SkeletonCircle size="20" />
          <SkeletonText mt="8" noOfLines={4} spacing="6" />
        </Box>
      ) : (
        product && <UpdateProductDetails product={product} />
      )}
    </Box>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, params }) => {
      const token = getCookie("token", { req, res });
      const { id } = params;
      await store.dispatch(getSingleProduct({ token, id }));
      return {
        props: {},
      };
    }
);
