import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, wrapper, AppDispatch } from "../../../store";
import { useRouter } from "next/router";
import {
  Box,
  SkeletonCircle,
  SkeletonText,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";

import NextLink from "next/link";

import { adminGetSingleOrder } from "../../../store/services/admin/adminOrderSlice";
import UpdateOrder from "../../../components/admin/order/UpdateOrder";
import withAuth from "../../../components/HOC/withAuth";
import AdminLayout from "../../../layout/AdminLayout";

function SingleOrder() {
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    dispatch(adminGetSingleOrder({ id }));
  }, [dispatch, id]);

  const { loading, order, error } = useSelector(
    (state: RootState) => state.adminOrderSlice
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
          <BreadcrumbLink as={NextLink} href="/admin/orders">
            Orders
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Update</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      {loading ? (
        <Box mx="auto" w="65%" padding="6" boxShadow="sm" bg="white">
          <SkeletonCircle size="20" />
          <SkeletonText mt="8" noOfLines={4} spacing="6" />
        </Box>
      ) : (
        order && <UpdateOrder order={order} />
      )}
    </Box>
  );
}

export default withAuth(SingleOrder, true);
