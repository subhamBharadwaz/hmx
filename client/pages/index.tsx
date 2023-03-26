import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { getTopSellingProducts } from "../store/services/product/productSlice";

import Home from "../components/Home";
import { Box, Text, Flex, List, HStack } from "@chakra-ui/react";
import { userDetails } from "../store/services/auth/auth-slice";
import NextLink from "next/link";

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(userDetails());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTopSellingProducts());
  }, [dispatch]);

  return (
    <>
      <Box
        display={["block", "block", "none"]}
        w="full"
        minH="52px"
        py={5}
        pos="sticky"
        top="0"
        color="black"
      >
        <Flex
          alignItems="center"
          justifyContent="flex-start"
          gap={10}
          w={["95%", "90%", "85%"]}
          mx="auto"
        >
          <List fontSize={18} fontWeight="semibold">
            <HStack spacing={10}>
              <NextLink href="/products/men">Men</NextLink>
              <NextLink href="/products/women">Women</NextLink>
            </HStack>
          </List>
        </Flex>
      </Box>
      <Box my="5%">
        <Home />
      </Box>
    </>
  );
}
