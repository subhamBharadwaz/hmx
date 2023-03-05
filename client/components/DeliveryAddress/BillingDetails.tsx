import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import NextLink from "next/link";

const BillingDetails = ({ totalPrice, makePayment, shippingAddress }) => {
  const toast = useToast();
  const id = "address-toast";
  return (
    <Box border="1px" borderColor="gray.200" py={2} minW={400}>
      <Box p={5} bg="blackAlpha.200" mt={-2}>
        <Text fontSize="sm" fontWeight="bold">
          BILLING DETAILS
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
            Total Amount
          </Text>
          <Text size="lg" fontWeight="bold">
            {`₹ ${totalPrice}`}
          </Text>
        </Flex>
      </Box>

      <Button
        size="lg"
        colorScheme="messenger"
        w="100%"
        mb="-2"
        borderRadius={0}
        onClick={() => {
          if (shippingAddress === null) {
            if (!toast.isActive(id)) {
              toast({
                id,
                title: "Please add your address.",
                description:
                  "You must add your address to proceed to payment section.",
                status: "error",
                position: "top-right",
                duration: 9000,
                isClosable: true,
              });
            }
          } else {
            makePayment();
          }
        }}
      >
        CONTINUE TO PAYMENT
      </Button>
    </Box>
  );
};

export default BillingDetails;
