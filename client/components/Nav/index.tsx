import { useRef } from "react";
import {
  Box,
  Flex,
  List,
  ListItem,
  HStack,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { BsBag, BsHeart } from "react-icons/bs";
import { HiMenuAlt1 } from "react-icons/hi";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { logoutUser } from "../../store/services/auth/auth-slice";
import Sidebar from "../Sidebar";

const Nav = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const menuRef = useRef();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { bagData } = useSelector((state: RootState) => state.bagSlice);
  const { wishlistData } = useSelector(
    (state: RootState) => state.wishlistSlice
  );

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
        <HStack>
          <Text fontSize="3xl" cursor="pointer" ref={menuRef} onClick={onOpen}>
            <HiMenuAlt1 />
          </Text>
          <Text fontSize="2xl">
            <NextLink href="/">HMX</NextLink>
          </Text>
        </HStack>
        <Sidebar isOpen={isOpen} onClose={onClose} menuRef={menuRef} />
        <List fontSize={18} fontWeight="semibold">
          <HStack spacing={10}>
            <NextLink href="/products/men">Men</NextLink>
            <NextLink href="/products/women">Women</NextLink>
          </HStack>
        </List>
        <List fontSize={18} fontWeight="semibold">
          <HStack spacing={10}>
            {user?.role === "admin" && (
              <ListItem>
                <NextLink href="/admin/">
                  <Button fontSize={18} colorScheme="messenger">
                    Admin Dashboard
                  </Button>
                </NextLink>
              </ListItem>
            )}
            <ListItem cursor="pointer" fontSize="2xl" pos="relative">
              {isAuthenticated && wishlistData && (
                <span className="item-count">
                  {wishlistData?.products !== undefined
                    ? wishlistData?.products?.length
                    : 0}
                </span>
              )}
              <NextLink href="/wishlist">
                <BsHeart />
              </NextLink>
            </ListItem>
            <ListItem cursor="pointer" fontSize="2xl" pos="relative">
              {isAuthenticated && bagData && (
                <span className="item-count">
                  {bagData?.products !== undefined
                    ? bagData?.products?.length
                    : 0}
                </span>
              )}
              <NextLink href="/bag">
                <BsBag />
              </NextLink>
            </ListItem>
            <ListItem>
              {isAuthenticated ? (
                <Button onClick={() => dispatch(logoutUser())}>Logout</Button>
              ) : (
                <NextLink href="/auth/login">
                  <Button>Login</Button>
                </NextLink>
              )}
            </ListItem>
            <ListItem>
              <NextLink href="/my-account">
                <Button>My Account</Button>
              </NextLink>
            </ListItem>
          </HStack>
        </List>
      </Flex>
    </Box>
  );
};

export default Nav;
