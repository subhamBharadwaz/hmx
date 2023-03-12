import { useSelector } from "react-redux";
import { RootState, wrapper } from "../../../store";

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

import { adminGetSingleOrder } from "../../../store/services/admin/adminOrderSlice";
import UpdateOrder from "../../../components/admin/order/UpdateOrder";

export default function SingleOrder() {
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

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, params }) => {
      const token = getCookie("token", { req, res });
      const { id } = params;
      await store.dispatch(adminGetSingleOrder({ token, id }));
      return {
        props: {},
      };
    }
);
