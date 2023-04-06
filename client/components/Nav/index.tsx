import { useRef, useState } from "react";
import {
  Box,
  Flex,
  List,
  ListItem,
  HStack,
  Text,
  Button,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { BsBag, BsHeart } from "react-icons/bs";
import { HiMenuAlt1 } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { logoutUser } from "../../store/services/auth/auth-slice";
import Sidebar from "../Sidebar";
import { useRouter } from "next/router";
import SearchInput from "../Search";
import { AiOutlineSearch } from "react-icons/ai";
import MobileSearch from "../Search/MobileSearch";

const Nav = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: MobileIsOpen,
    onOpen: MobileOnOpen,
    onClose: MobileOnClose,
  } = useDisclosure();
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
      w="full"
      minH="52px"
      py={5}
      pos="sticky"
      top="0"
      zIndex={100}
      color="black"
      backdropFilter="blur(8px)"
      background="whiteAlpha.400"
      boxShadow="rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;"
    >
      <Stack
        direction="row"
        w={["95%", "95%", "90%"]}
        mx="auto"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack spacing={3}>
          <Text fontSize="3xl" cursor="pointer" ref={menuRef} onClick={onOpen}>
            <HiMenuAlt1 />
          </Text>
          <Text fontSize="2xl">
            <NextLink href="/">HMX</NextLink>
          </Text>
        </HStack>
        <Sidebar isOpen={isOpen} onClose={onClose} menuRef={menuRef} />

        <List
          fontSize={18}
          fontWeight="semibold"
          display={["none", "none", "block"]}
        >
          <HStack spacing={5}>
            <NextLink href="/products/men">Men</NextLink>
            <NextLink href="/products/women">Women</NextLink>
          </HStack>
        </List>
        <HStack spacing={3}>
          <List fontWeight="semibold">
            <HStack spacing={[1, 1, 5]}>
              {user?.role === "admin" && (
                <ListItem display={["none", "none", "block"]}>
                  <NextLink href="/admin/">
                    <Button colorScheme="messenger">Admin Dashboard</Button>
                  </NextLink>
                </ListItem>
              )}
              <ListItem display={["none", "none", "block"]}>
                <SearchInput />
              </ListItem>
              <ListItem display={["block", "block", "none"]}>
                <IconButton
                  fontSize="2xl"
                  variant="unstyled"
                  aria-label="Search database"
                  icon={<AiOutlineSearch />}
                  onClick={MobileOnOpen}
                />
                <MobileSearch onClose={MobileOnClose} isOpen={MobileIsOpen} />
              </ListItem>
              <ListItem>
                {isAuthenticated ? (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<AiOutlineUser />}
                      fontSize="2xl"
                      aria-label="User options"
                      variant="unstyled"
                    />
                    <MenuList fontSize="md" zIndex={100}>
                      <NextLink href="/my-account">
                        <MenuItem>My Account</MenuItem>
                      </NextLink>
                      <NextLink href="/my-account/orders">
                        <MenuItem>My Orders</MenuItem>
                      </NextLink>
                      <NextLink href="/wishlist">
                        <MenuItem>My Wishlist</MenuItem>
                      </NextLink>
                      <NextLink href="/my-account/profile">
                        <MenuItem>My Profile</MenuItem>
                      </NextLink>
                      <MenuItem onClick={() => dispatch(logoutUser())}>
                        Logout
                      </MenuItem>
                    </MenuList>
                  </Menu>
                ) : (
                  <Button mr={5} colorScheme="messenger">
                    <NextLink href="/auth/login">Login</NextLink>
                  </Button>
                )}
              </ListItem>
              <ListItem cursor="pointer" fontSize="2xl" pos="relative">
                {isAuthenticated && wishlistData && (
                  <span className="item-count">
                    {wishlistData?.products !== undefined
                      ? wishlistData?.products?.length
                      : 0}
                  </span>
                )}
                <NextLink href="/wishlist">
                  <IconButton
                    fontSize="2xl"
                    variant="unstyled"
                    aria-label="Search database"
                    icon={<BsHeart />}
                  />
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
                  <IconButton
                    fontSize="2xl"
                    variant="unstyled"
                    aria-label="Search database"
                    icon={<BsBag />}
                  />
                </NextLink>
              </ListItem>
            </HStack>
          </List>
        </HStack>
      </Stack>
    </Box>
  );
};

export default Nav;
