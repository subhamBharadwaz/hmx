import { useEffect } from "react";
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

import NextLink from "next/link";
import { useRouter } from "next/router";
import withAuth from "../../../components/HOC/withAuth";
import AdminLayout from "../../../layout/AdminLayout";

function SingleUserDetails() {
  const { loading, user, error } = useSelector(
    (state: RootState) => state.adminUserSlice
  );

  const auth = useSelector((state: RootState) => state.auth);

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

        <BreadcrumbItem>
          <BreadcrumbLink as={NextLink} href="/admin/users">
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

export default withAuth(SingleUserDetails);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, params }) => {
      const token = getCookie("token", { req, res });
      const { id } = params;
      await store
        .dispatch(getSingleUser({ token, id }))
        .unwrap()
        .then(() => {})
        .catch((err) => {
          res.writeHead(302, { Location: "/404" });
          res.end();
        });
      return {
        props: {},
      };
    }
);
