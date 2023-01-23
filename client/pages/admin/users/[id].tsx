import React from "react";

import { useSelector } from "react-redux";
import { RootState, wrapper } from "../../../store";

import UpdateUserDetails from "../../../components/admin/user/UpdateUserDetails";
import { getSingleUser } from "../../../store/services/admin/adminUserSlice";
import { getCookie } from "cookies-next";

import {
  Box,
  SkeletonCircle,
  SkeletonText,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";

import Link from "next/link";

export default function SingleUserDetails() {
  const { loading, user } = useSelector(
    (state: RootState) => state.adminUserSlice
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
          <BreadcrumbLink as={Link} href="/admin/users">
            Users
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>User</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      {loading ? (
        <Box mx="auto" w="65%" padding="6" boxShadow="sm" bg="white">
          <SkeletonCircle size="20" />
          <SkeletonText mt="8" noOfLines={4} spacing="6" />
        </Box>
      ) : (
        user && <UpdateUserDetails user={user} />
      )}
    </Box>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, params }) => {
      const token = getCookie("token", { req, res });
      const { id } = params;
      await store.dispatch(getSingleUser({ token, id }));
      return {
        props: {},
      };
    }
);