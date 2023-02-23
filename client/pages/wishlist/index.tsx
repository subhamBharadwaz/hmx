import { useEffect } from "react";
import WishlistItem from "../../components/WishlistItem";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import NextImage from "next/image";
import NextLink from "next/link";
import {
  Box,
  SkeletonCircle,
  SkeletonText,
  Text,
  Button,
  SimpleGrid,
  HStack,
} from "@chakra-ui/react";
import { getWishlistItems } from "../../store/services/wishlist/wishlistSlice";

export default function Wishlist() {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, wishlistData } = useSelector(
    (state: RootState) => state.wishlistSlice
  );

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    dispatch(getWishlistItems());
  }, [dispatch]);

  return (
    <Box my="5%">
      {loading ? (
        <Box padding="6" boxShadow="lg" bg="white">
          <SkeletonCircle size="10" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
        </Box>
      ) : !isAuthenticated ? (
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
              src="/static/svgs/authentication.svg"
              layout="fill"
              objectFit="cover"
              alt="Banner"
            />
          </Box>
          <Text fontSize="xl" fontWeight="bold" my={5}>
            Please login to view your wish-list.
          </Text>

          <HStack>
            <Button colorScheme="messenger" size="lg">
              <NextLink href="/auth/register">Register</NextLink>
            </Button>
            <Button colorScheme="messenger" variant="outline" size="lg">
              <NextLink href="/auth/login">Login</NextLink>
            </Button>
          </HStack>
        </Box>
      ) : (
        <Box>
          {wishlistData && wishlistData?.products?.length > 0 ? (
            <SimpleGrid minChildWidth="250px" spacing={5} p={[10, 0, 0]}>
              {wishlistData?.products?.map((product) => (
                <WishlistItem key={product.productId} product={product} />
              ))}
            </SimpleGrid>
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
        </Box>
      )}
    </Box>
  );
}
