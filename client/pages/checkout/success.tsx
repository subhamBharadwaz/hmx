import { Box, Flex, Text, Button } from "@chakra-ui/react";
import Lottie from "react-lottie";
import animationData from "../../public/static/lottie/payment-success.json";
import NextLink from "next/link";

export default function PaymentSuccess() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Flex alignItems="center" justifyContent="center" direction="column">
      <Lottie options={defaultOptions} height={400} width={400} />
      <Text fontSize={24} fontWeight="semibold">
        Your Payment is Successful
      </Text>
      <Text fontSize={18} color="blackAlpha.600" my={3}>
        Thank you for your payment. An automated payment receipt will be sent to
        your registered email.
      </Text>
      <Button mt={5} variant="outline" colorScheme="messenger">
        <NextLink href="/">Back to Home</NextLink>
      </Button>
    </Flex>
  );
}
