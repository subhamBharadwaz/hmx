import { Box, Flex, Text, Button, Stack } from "@chakra-ui/react";
import Lottie from "react-lottie";
import animationData from "../public/static/lottie/error-404.json";
import NextLink from "next/link";

export default function NotFound() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      direction={["column-reverse", "column-reverse", "row"]}
    >
      <Stack mt={[10, 10, 9]} spacing={[10, 10, 10]}>
        <Stack>
          <Text fontSize={["2xl", "2xl", "6xl"]} fontWeight="semibold">
            Oops! Page not found
          </Text>
          <Text fontSize={["xl", "xl", "2xl"]} color="blackAlpha.600" my={3}>
            The page you are looking for does not exist. Please check the URL
            and try again.
          </Text>
        </Stack>

        <Button
          variant="outline"
          colorScheme="messenger"
          size={["md", "md", "lg"]}
          alignSelf={[null, null, "flex-start"]}
        >
          <NextLink href="/">Back to Home</NextLink>
        </Button>
      </Stack>

      <Lottie options={defaultOptions} height={400} width={400} />
    </Flex>
  );
}
