import React from "react";
import { wrapper } from "../../../store";
import { getCookie } from "cookies-next";
import { getSingleOrder } from "../../../store/services/order/orderSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import SingleOrderDetails from "../../../components/MyAccount/Order/SingleOrderDetails";
import { Box, HStack, Text, Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { BsChevronLeft } from "react-icons/bs";
import withAuth from "../../../components/HOC/withAuth";

function Order() {
  const { loading, order } = useSelector(
    (state: RootState) => state.orderSlice
  );
  return (
    <Box>
      <NextLink href="/my-account/orders">
        <Button
          mb={10}
          color="blue.400"
          variant="link"
          size="lg"
          leftIcon={<BsChevronLeft />}
        >
          Back to My Orders
        </Button>
      </NextLink>
      {order && <SingleOrderDetails order={order} />}
    </Box>
  );
}

export default withAuth(Order);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, params }) => {
      const token = getCookie("token", { req, res });
      const { id } = params;
      await store.dispatch(getSingleOrder({ token, id }));
      return {
        props: {},
      };
    }
);
