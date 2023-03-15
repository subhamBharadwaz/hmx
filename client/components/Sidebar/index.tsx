import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
  Divider,
  Stack,
  Text,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { logoutUser } from "../../store/services/auth/auth-slice";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,

    transition: {
      staggerChildren: 0.05,
      ease: "easeIn",
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0 },
};

const Sidebar = ({ isOpen, onClose, menuRef }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      finalFocusRef={menuRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader fontWeight="bold">
          <HStack>
            <Text> Hello {`${user?.firstName} ${user?.lastName}`}</Text>
            <Avatar
              size="md"
              name={user?.firstName}
              src={user?.photo?.secure_url}
            />
          </HStack>
        </DrawerHeader>
        <Divider />
        <DrawerBody mt={5}>
          <Stack
            spacing={5}
            as={motion.div}
            variants={container}
            initial="hidden"
            animate="show"
          >
            <Stack spacing={5}>
              <Text
                fontWeight="bold"
                color="blackAlpha.500"
                fontSize="md"
                as={motion.div}
                variants={item}
              >
                SHOP IN
              </Text>
              <NextLink href="/products/men">
                <Text
                  fontWeight="bold"
                  fontSize="sm"
                  cursor="pointer"
                  as={motion.div}
                  onClick={onClose}
                  variants={item}
                >
                  Men
                </Text>
              </NextLink>
              <NextLink href="/products/women">
                <Text
                  fontWeight="bold"
                  cursor="pointer"
                  fontSize="sm"
                  onClick={onClose}
                  as={motion.div}
                  variants={item}
                >
                  Women
                </Text>
              </NextLink>
            </Stack>
            <Stack spacing={5}>
              <Text
                fontWeight="bold"
                color="blackAlpha.500"
                fontSize="md"
                as={motion.div}
                variants={item}
              >
                MY PROFILE
              </Text>
              <NextLink href="/my-account">
                <Text
                  fontWeight="bold"
                  fontSize="sm"
                  cursor="pointer"
                  onClick={onClose}
                  as={motion.div}
                  variants={item}
                >
                  My Account
                </Text>
              </NextLink>
              <NextLink href="/my-account/orders">
                <Text
                  fontWeight="bold"
                  fontSize="sm"
                  cursor="pointer"
                  onClick={onClose}
                  as={motion.div}
                  variants={item}
                >
                  My Orders
                </Text>
              </NextLink>
              <NextLink href="/wishlist">
                <Text
                  fontWeight="bold"
                  fontSize="sm"
                  cursor="pointer"
                  onClick={onClose}
                  as={motion.div}
                  variants={item}
                >
                  My Wishlist
                </Text>
              </NextLink>
            </Stack>
            <Stack spacing={5}>
              <Text
                fontWeight="bold"
                color="blackAlpha.500"
                fontSize="md"
                as={motion.div}
                variants={item}
              >
                CONTACT US
              </Text>
              <Text
                fontWeight="bold"
                fontSize="sm"
                as={motion.div}
                variants={item}
              >
                Help & Support
              </Text>
              <Text
                fontWeight="bold"
                fontSize="sm"
                as={motion.div}
                variants={item}
              >
                Feedback & Suggestions
              </Text>
            </Stack>
            <Stack spacing={5}>
              <Text
                fontWeight="bold"
                color="blackAlpha.500"
                fontSize="md"
                as={motion.div}
                variants={item}
              >
                ABOUT US
              </Text>
              <Text
                fontWeight="bold"
                fontSize="sm"
                as={motion.div}
                variants={item}
              >
                Our Story
              </Text>
              <Text
                fontWeight="bold"
                fontSize="sm"
                as={motion.div}
                variants={item}
              >
                Blog
              </Text>
            </Stack>
            <Stack spacing={5}>
              <Text
                fontWeight="bold"
                fontSize="sm"
                cursor="pointer"
                as={motion.div}
                variants={item}
                onClick={() => {
                  onClose;
                  dispatch(logoutUser());
                }}
              >
                Logout
              </Text>
            </Stack>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
