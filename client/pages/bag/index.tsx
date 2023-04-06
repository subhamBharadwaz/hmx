import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Stack,
  Button,
  Skeleton,
  HStack,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";

import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import NextImage from "next/image";
import NextLink from "next/link";

import { AppDispatch, RootState } from "../../store";
import { getBagItems } from "../../store/services/bag/bagSlice";
import SingleBagItemCard from "../../components/Bag/SingleBagItemCard";
import TotalPrice from "../../components/Bag/TotalPrice";
import { Toast } from "../../components/Toast";

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

const bagItemsAnim = {
  hidden: { opacity: 0, x: -200 },
  show: { opacity: 1, x: 0 },
};
const amountAnim = {
  hidden: { opacity: 0, x: 200 },
  show: { opacity: 1, x: 0 },
};

export default function Bag() {
  const dispatch = useDispatch<AppDispatch>();
  const [apiError, setApiError] = useState<string | null>(null);

  const { addToast } = Toast();

  const { loading, bagData, error } = useSelector(
    (state: RootState) => state.bagSlice
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getBagItems())
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
          <BreadcrumbLink>Bag</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box my={20}>
        {loading ? (
          <Stack>
            <Skeleton height="40px" />
            <Skeleton height="40px" />
            <Skeleton height="40px" />
          </Stack>
        ) : !isAuthenticated ? (
          <Box
            w="100%"
            h="100%"
            mb={[10, 10, 0]}
            mr={[0, 0, "2em"]}
            display="flex"
            flexDir="column"
            justifyContent="center"
            alignItems="center"
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
              Please login to view your cart.
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
            {bagData && bagData?.products?.length > 0 ? (
              <Flex
                justifyContent="space-between"
                as={motion.div}
                variants={container}
                direction={["column", "column", "row"]}
                initial="hidden"
                animate="show"
                mb={30}
              >
                <Box w={["100%", "100%", "60%"]}>
                  {bagData?.products?.map((product) => (
                    <SingleBagItemCard
                      key={product.productId}
                      productData={product}
                      variants={bagItemsAnim}
                    />
                  ))}
                </Box>
                <Box
                  w={["100%", "100%", " 35%"]}
                  as={motion.div}
                  variants={amountAnim}
                >
                  <TotalPrice totalPrice={bagData?.totalPrice} />
                </Box>
              </Flex>
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
                    src="/static/svgs/emptyCart.svg"
                    layout="fill"
                    objectFit="cover"
                    alt="Banner"
                  />
                </Box>
                <Text fontSize="xl" fontWeight="bold" my={5}>
                  Your shopping cart is empty.
                </Text>
                <Text fontSize="lg" mb={5}>
                  Please add something soon, carts have feelings too.
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
