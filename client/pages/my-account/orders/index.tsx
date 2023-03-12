import { useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import OrderCard from "../../../components/MyAccount/Order/OrderCard";
import { AppDispatch, RootState } from "../../../store";
import { getAllOrders } from "../../../store/services/order/orderSlice";
import NextLink from "next/link";
import { BsChevronLeft } from "react-icons/bs";

export default function Orders() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const { orders } = useSelector((state: RootState) => state.orderSlice);

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
              orderItems={order?.orderItems}
            />
          ))}
      </Box>
    </>
  );
}
