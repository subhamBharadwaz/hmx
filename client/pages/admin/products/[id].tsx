import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, wrapper } from "../../../store";

interface IProductSize {
  value: string;
  label: string;
}

import {
  Box,
  SkeletonCircle,
  SkeletonText,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";

import { getSingleProduct } from "../../../store/services/admin/adminProductSlice";
import NextLink from "next/link";
import UpdateProductDetails from "../../../components/admin/product/UpdateProductDetails";
import withAuth from "../../../components/HOC/withAuth";
import AdminLayout from "../../../layout/AdminLayout";

function SingleProductDetails() {
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    dispatch(getSingleProduct({ id }));
  }, [dispatch, id]);

  const { loading, product, error } = useSelector(
    (state: RootState) => state.adminProductSlice
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
          <BreadcrumbLink as={NextLink} href="/admin/products">
            Products
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Edit</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      {loading ? (
        <Box mx="auto" w="65%" padding="6" boxShadow="sm" bg="white">
          <SkeletonCircle size="20" />
          <SkeletonText mt="8" noOfLines={4} spacing="6" />
        </Box>
      ) : (
        product && <UpdateProductDetails product={product} />
      )}
    </Box>
  );
}

export default withAuth(SingleProductDetails, true);
