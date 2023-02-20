import React from "react";
import WishlistItem from "../../components/WishlistItem";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import NextImage from "next/image";
import NextLink from "next/link";
import {
  Box,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  Button,
} from "@chakra-ui/react";

export default function Wishlist() {
  const { loading, wishlistData } = useSelector(
    (state: RootState) => state.wishlistSlice
  );
  return (
    <Box my="5%">
      {loading ? (
        <Box padding="6" boxShadow="lg" bg="white">
          <SkeletonCircle size="10" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
        </Box>
      ) : (
        <Stack direction="row" spacing={5}>
          {wishlistData && wishlistData?.products?.length > 0 ? (
            wishlistData?.products?.map((product) => (
              <WishlistItem key={product.productId} product={product} />
            ))
          ) : (
            <Box
              w="100%"
              h="100%"
              mb={[10, 10, 0]}
              mr={[0, 0, "2em"]}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDir="column"
            >
              <Box position="relative" w={300} h={300}>
                <NextImage
                  src="/static/svgs/emptyWishlist.svg"
                  layout="fill"
                  objectFit="cover"
                  alt="Banner"
                />
              </Box>
              <Text fontSize="xl" fontWeight="bold" my={5}>
                Your wishlist is lonely and looking for love.
              </Text>
              <Text fontSize="lg" mb={5}>
                Add products to your wishlist, review them anytime and easily
                move to cart.
              </Text>
              <Button colorScheme="messenger" size="lg">
                <NextLink href="/">Continue Shopping</NextLink>
              </Button>
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
}
