import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { BsChevronLeft } from "react-icons/bs";
import { Box, HStack, Text, Button } from "@chakra-ui/react";

import { wrapper } from "../../../store";
import { getSingleOrder } from "../../../store/services/order/orderSlice";
import { RootState, AppDispatch } from "../../../store";
import SingleOrderDetails from "../../../components/MyAccount/Order/SingleOrderDetails";
import withAuth from "../../../components/HOC/withAuth";

function Order() {
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    dispatch(getSingleOrder({ id }));
  }, [dispatch, id]);

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
