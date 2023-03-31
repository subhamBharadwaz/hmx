import {
  Box,
  Button,
  HStack,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { BsChevronRight } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/services/auth/auth-slice";
import { AppDispatch } from "../../store";
import withAuth from "../../components/HOC/withAuth";

function MyAccount() {
  const dispatch = useDispatch<AppDispatch>();
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
          <BreadcrumbLink>My Account</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box>
        <NextLink href="/my-account/profile">
          <HStack
            justifyContent="space-between"
            borderBottom="1px"
            borderColor="blackAlpha.200"
            py={5}
            cursor="pointer"
            _hover={{ color: "blue.500" }}
            transition="ease-in"
            transitionDuration=".1s"
          >
            <Text fontWeight="bold" fontSize="lg">
              Profile
            </Text>
            <BsChevronRight />
          </HStack>
        </NextLink>
        <NextLink href="/my-account/orders">
          <HStack
            justifyContent="space-between"
            borderBottom="1px"
            borderColor="blackAlpha.200"
            py={5}
            cursor="pointer"
            _hover={{ color: "blue.500" }}
            transition="ease-in"
            transitionDuration=".1s"
          >
            <Text fontWeight="bold" fontSize="lg">
              My Orders
            </Text>
            <BsChevronRight />
          </HStack>
        </NextLink>
      </Box>
      <Button
        mt={10}
        w="100%"
        variant="outline"
        colorScheme="messenger"
        size="md"
        onClick={() => dispatch(logoutUser())}
      >
        Log Out
      </Button>
    </>
  );
}

export default withAuth(MyAccount);
