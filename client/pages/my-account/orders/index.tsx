import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import OrderCard from "../../../components/MyAccount/Order/OrderCard";
import { AppDispatch, RootState } from "../../../store";
import { getAllOrders } from "../../../store/services/order/orderSlice";
import NextLink from "next/link";
import { BsChevronLeft } from "react-icons/bs";
import withAuth from "../../../components/HOC/withAuth";

function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const [apiError, setApiError] = useState<string | null>(null);

  const { orders, error } = useSelector((state: RootState) => state.orderSlice);

  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({
        id: "orders-toast",
        title: "Unable to fetch orders.",
        description: error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  useEffect(() => {
    dispatch(getAllOrders())
      .unwrap()
      .then(() => {})
      .catch((error: { message: string }) => {
        setApiError(error.message);
      });
  }, [dispatch]);

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
        <BreadcrumbItem>
          <BreadcrumbLink as={NextLink} href="/my-account">
            My Account
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>My Orders</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box>
        <NextLink href="/my-account">
          <Button
            mb={10}
            color="blue.400"
            variant="link"
            size="lg"
            leftIcon={<BsChevronLeft />}
          >
            Back to My Account
          </Button>
        </NextLink>
        <Heading size="xl" mb={5}>
          My Orders
        </Heading>

        {orders &&
          orders?.map((order) => (
            <OrderCard
              id={order._id}
              key={order._id}
              order={order}
              orderItems={order?.orderItems}
            />
          ))}
      </Box>
    </>
  );
}

export default withAuth(Orders, false);
