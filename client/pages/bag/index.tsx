import { Box, Text, Stack, Button, Skeleton } from "@chakra-ui/react";

import { useSelector } from "react-redux";
import SingleBagItemCard from "../../components/Bag/SingleBagItemCard";
import { RootState } from "../../store";

import NextImage from "next/image";
import NextLink from "next/link";

export default function Bag() {
  const { loading, bagData } = useSelector(
    (state: RootState) => state.bagSlice
  );

  return (
    <Box my={20}>
      {loading ? (
        <Stack>
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
        </Stack>
      ) : (
        <Box>
          {bagData && bagData?.products?.length > 0 ? (
            bagData?.products?.map((product) => (
              <SingleBagItemCard
                key={product.productId}
                productData={product}
              />
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
  );
}
