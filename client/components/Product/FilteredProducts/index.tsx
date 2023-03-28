import { useState, useEffect } from "react";
import { IProduct } from "../../../types/product";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
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
}

const FilteredProducts = ({ products }: IFilterProducts) => {
  const dispatch = useDispatch<AppDispatch>();
  const { wishlistData, loading } = useSelector(
    (state: RootState) => state.wishlistSlice
  );

  return (
    <SimpleGrid
      minChildWidth={200}
      mx="auto"
      spacingX="20px"
      spacingY="40px"
      as={motion.div}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {products?.map((product) => (
        <Box
          cursor="pointer"
          key={product?._id}
          position="relative"
          as={motion.div}
          variants={item}
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
  );
};

export default FilteredProducts;
