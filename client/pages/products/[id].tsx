import { useSelector } from "react-redux";
import SingleProduct from "../../components/Product/SingleProduct";
import { RootState, wrapper } from "../../store";
import { getSingleProduct } from "../../store/services/product/productSlice";
import {
  Box,
  SkeletonText,
  SkeletonCircle,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import NextLink from "next/link";
import ProductImageModel from "../../components/Product/ProductImageModel";

const Product = () => {
  const { loading, product, error } = useSelector(
    (state: RootState) => state.productSlice
  );

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
          <BreadcrumbLink as={NextLink} href="/products">
            Products
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{product?.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      {loading ? (
        <Box padding="6" boxShadow="lg" bg="white">
          <SkeletonCircle size="10" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
        </Box>
      ) : (
        <Box>
          <SingleProduct product={product} />
        </Box>
      )}
    </>
  );
};

export default Product;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, params }) => {
      const { id } = params;
      await store.dispatch(getSingleProduct(id));
      return {
        props: {},
      };
    }
);
