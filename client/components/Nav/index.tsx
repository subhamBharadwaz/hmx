import {
  Box,
  Flex,
  List,
  ListItem,
  HStack,
  Text,
  Button,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { BsBag, BsHeart } from "react-icons/bs";

import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Nav = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { bagData } = useSelector((state: RootState) => state.bagSlice);

  return (
    <Box
      minW="100%"
      minH={20}
      py={5}
      pos="sticky"
      top="0"
      zIndex={100}
      color="black"
      backdropFilter="blur(8px)"
      background="whiteAlpha.400"
      boxShadow="rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;"
    >
      <Flex
        w={["100%", "80%", "80%"]}
        mx="auto"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize="2xl">
          <NextLink href="/">HMX</NextLink>
        </Text>
        <List fontSize={18} fontWeight="semibold">
          <HStack spacing={10}>
            <ListItem>Men</ListItem>
            <ListItem>Women</ListItem>
          </HStack>
        </List>
        <List fontSize={18} fontWeight="semibold">
          <HStack spacing={10}>
            {!isAuthenticated && <ListItem>Login</ListItem>}
            {user?.user?.role === "admin" && (
              <ListItem>
                <NextLink href="/admin/">
                  <Button fontSize={18} colorScheme="messenger">
                    Admin Dashboard
                  </Button>
                </NextLink>
              </ListItem>
            )}
            <ListItem cursor="pointer" fontSize="2xl">
              <NextLink href="/">
                <BsHeart />
              </NextLink>
            </ListItem>
            <ListItem cursor="pointer" fontSize="2xl" pos="relative">
              {bagData && (
                <span className="bag-item-counter">
                  {bagData.products !== undefined ? bagData.products.length : 0}
                </span>
              )}
              <NextLink href="/bag">
                <BsBag />
              </NextLink>
            </ListItem>
          </HStack>
        </List>
      </Flex>
    </Box>
  );
};

export default Nav;
