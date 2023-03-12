import { useEffect } from "react";
import {
  Box,
  Spinner,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../../../store";

import NextLink from "next/link";

import Pagination from "../../../components/Pagination";
import { adminGetAllOrders } from "../../../store/services/admin/adminOrderSlice";
import OrdersTable from "../../../components/admin/order/OrderTable";

export default function Orders() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(adminGetAllOrders());
  }, [dispatch]);

  const { orders, order, error, message, loading } = useSelector(
    (state: RootState) => state.adminOrderSlice
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
          <BreadcrumbLink isCurrentPage>Orders</BreadcrumbLink>
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
          <OrdersTable orders={orders} />
        )}
      </Flex>
      {/* <Pagination data={users} action={getAllUsers} /> */}
    </Box>
  );
}
