import React from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import NextLink from "next/link";
const TotalPrice = ({ totalPrice }) => {
  return (
    <Box border="1px" borderColor="gray.200" py={2}>
      <Box p={5} bg="blackAlpha.200" mt={-2}>
        <Text fontSize="sm" fontWeight="bold">
          PRICE SUMMARY
        </Text>
      </Box>
      <Box p={5} borderBottom="1px" borderColor="gray.200">
        <Flex alignItems="center" justifyContent="space-between">
          <Text>Total MRP (Incl. of taxes)</Text>
          <Text>{`₹ ${totalPrice}`}</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" my={3}>
          <Text>Shipping Charges </Text>
          <Text color="blue.300" fontWeight="bold">
            FREE
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text size="lg" fontWeight="bold">
            Subtotal
          </Text>
          <Text size="lg" fontWeight="bold">
            {`₹ ${totalPrice}`}
          </Text>
        </Flex>
      </Box>
      <Box p={5}>
        <Flex alignItems="center" justifyContent="space-between">
          <Text size="lg" fontWeight="bold">
            Total {`₹ ${totalPrice}`}
          </Text>
          <Button size="lg" colorScheme="messenger">
            <NextLink href="/checkout">PLACE ORDER</NextLink>
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default TotalPrice;
