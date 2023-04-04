import { useEffect, useState } from "react";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
} from "@chakra-ui/react";
import { getWishlistItems } from "../../store/services/wishlist/wishlistSlice";
import { motion } from "framer-motion";

// Animation
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,

    transition: {
      staggerChildren: 0.1,
      ease: "easeIn",
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -100 },
  show: { opacity: 1, x: 0 },
};

export default function Wishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const [apiError, setApiError] = useState<string | null>(null);

  const { loading, wishlistData, error } = useSelector(
    (state: RootState) => state.wishlistSlice
  );
  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({
        id: "error-toast",
        title: "Unable to fetch wishlist items.",
        description: error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    dispatch(getWishlistItems())
      .unwrap()
      .then(() => {})
      .catch((error: { message: string }) => {
        setApiError(error.message);
      });
  }, [dispatch]);

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
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Wishlist</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box mb={[40, 40, 10]}>
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
            mr={[0, 0, 2]}
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
              <SimpleGrid
                minChildWidth={200}
                spacing={10}
                p={[10, 0, 0]}
                as={motion.div}
                variants={container}
                initial="hidden"
                animate="show"
              >
                {wishlistData?.products?.map((product) => (
                  <WishlistItem
                    key={product.productId}
                    product={product}
                    variants={item}
                  />
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
    </>
  );
}
