import { useEffect } from "react";
import {
  Box,
  Spinner,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import UsersTable from "../../../components/admin/user/UsersTable";
import { RootState } from "../../../store";
import { getAllUsers } from "../../../store/services/admin/adminUserSlice";
import NextLink from "next/link";
import { useRouter } from "next/router";
import Pagination from "../../../components/Pagination";

export default function Users() {
  const { loading, users, error } = useSelector(
    (state: RootState) => state.adminUserSlice
  );

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
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
          <BreadcrumbLink isCurrentPage>Users</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex alignItems="center" justifyContent="center" flex={1}>
        {loading ? (
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
          />
        ) : (
          <UsersTable users={users.users} />
        )}
      </Flex>
      <Pagination data={users} action={getAllUsers} />
    </Box>
  );
}
