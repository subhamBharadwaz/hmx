import { useState, useEffect } from "react";
import { IProduct } from "../../../types/product";
import { Box, SimpleGrid, Text, Center, Spinner } from "@chakra-ui/react";
import NextImage from "next/image";
import { BsSuitHeart, BsFillHeartFill } from "react-icons/bs";
import NextLink from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  createWishlist,
  deleteWishlistItem,
} from "../../../store/services/wishlist/wishlistSlice";

// Animation
import { motion } from "framer-motion";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,

    transition: {
      staggerChildren: 0.1,
      ease: "easeInOut",
    },
  },
};

const item = {
  hidden: { opacity: 0, x: 100 },
  show: { opacity: 1, x: 0 },
};

interface IFilterProducts {
  products: IProduct[];
  total: number;
  category?: string | string[];
  gender?: string | string[];
  size?: string | string[];
  page?: string;
  limit?: string;
  minPrice?: number;
  maxPrice?: number;
  sortDirection?: string;
  sortBy?: string;
  search?: string | string[];
}

const Loading = () => {
  return (
    <Center mt={30}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Center>
  );
};

const FilteredProducts = ({
  products,
  total,
  category,
  gender,
  size,
  page,
  limit,
  minPrice,
  maxPrice,
  sortDirection,
  sortBy,
  search,
}: IFilterProducts) => {
  const dispatch = useDispatch<AppDispatch>();
  const [productsPage, setProductsPage] = useState(1);
  const [allProducts, setAllProducts] = useState(products);

  const { wishlistData, loading } = useSelector(
    (state: RootState) => state.wishlistSlice
  );

  const loadMore = async () => {
    try {
      const newProducts = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/products?page=${
          productsPage || "1"
        }&limit=${limit || "6"}&category=${category || "All"}&gender=${
          gender || "All"
        }&size=${size || "All"}&minPrice=${minPrice || 499}&maxPrice=${
          maxPrice || 3999
        }&sortDirection=${sortDirection}&sortBy=${sortBy || "price"}&search=${
          search || ""
        }`
      );

      setAllProducts((prevProducts) => [
        ...prevProducts,
        ...newProducts.data.products,
      ]);
      setProductsPage(productsPage + 1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <InfiniteScroll
      dataLength={allProducts.length}
      next={loadMore}
      hasMore={total > allProducts.length}
      loader={
        <Center mt={30}>
          <Text fontSize="3xl">Loading...</Text>
        </Center>
      }
    >
      <SimpleGrid
        minChildWidth={200}
        mx="auto"
        spacingX="20px"
        spacingY="40px"
        as={motion.div}
        variants={container}
        initial="hidden"
        animate="show"
        overflow="hidden"
        minH="100vh"
      >
        {allProducts?.map((product) => (
          <Box
            cursor="pointer"
            key={product?._id}
            position="relative"
            as={motion.div}
            variants={item}
            maxW={400}
          >
            <span
              className={
                wishlistData?.products?.some((p) => p.productId === product._id)
                  ? "wishlist-icon-fill"
                  : "wishlist-icon"
              }
              onClick={() =>
                wishlistData?.products?.some((p) => p.productId === product._id)
                  ? dispatch(deleteWishlistItem({ productId: product._id }))
                  : dispatch(createWishlist({ productId: product._id }))
              }
            >
              {wishlistData?.products?.some(
                (p) => p.productId === product._id
              ) ? (
                <BsFillHeartFill />
              ) : (
                <BsSuitHeart />
              )}
            </span>
            <NextLink href="/products/[id]" as={`/products/${product._id}`}>
              <Box>
                <Box h={350} w="100%" position="relative">
                  <NextImage
                    src={product?.photos[0]?.secure_url}
                    alt={product?.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </Box>
                <Text fontSize="sm" fontWeight="bold">
                  {product?.name}
                </Text>
                <Text fontSize="md" color="blackAlpha.600">
                  {product?.category}
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  ₹ {product?.price}
                </Text>
              </Box>
            </NextLink>
          </Box>
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
};

export default FilteredProducts;
