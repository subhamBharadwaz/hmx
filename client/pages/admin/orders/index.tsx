import { useEffect, useState } from "react";
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
import withAuth from "../../../components/HOC/withAuth";
import AdminLayout from "../../../layout/AdminLayout";
import { Toast } from "../../../components/Toast";

function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const [apiError, setApiError] = useState<string | null>(null);

  const { addToast } = Toast();

  const { orders, order, error, loading } = useSelector(
    (state: RootState) => state.adminOrderSlice
  );

  useEffect(() => {
    dispatch(adminGetAllOrders())
      .unwrap()
      .then(() => {})
      .catch((error: { message: string }) => {
        setApiError(error.message);
      });
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      addToast({
        id: "orders-toast",
        title: "Order action failed.",
        description: error,
        status: "error",
      });
    }
  }, [error, addToast]);

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

export default withAuth(Orders, true);
