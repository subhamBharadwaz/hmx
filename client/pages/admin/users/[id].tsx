import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, wrapper } from "../../../store";

import UpdateUserDetails from "../../../components/admin/user/UpdateUserDetails";
import { getSingleUser } from "../../../store/services/admin/adminUserSlice";

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
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    dispatch(getSingleUser({ id }));
  }, [dispatch, id]);

  const { loading, user, error } = useSelector(
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

export default withAuth(SingleUserDetails, true);
