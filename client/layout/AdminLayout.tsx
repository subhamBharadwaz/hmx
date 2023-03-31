import {
  Box,
  Flex,
  Menu,
  Text,
  HStack,
  MenuButton,
  MenuItem,
  Avatar,
  VStack,
  MenuList,
  MenuDivider,
  useColorModeValue,
} from "@chakra-ui/react";
import Sidebar from "../components/admin/Sidebar";
import NextLink from "next/link";
import React from "react";
import { FiChevronDown } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const AdminLayout = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <>
      <Box
        w="full"
        height="20"
        display={["none", "none", "block"]}
        mb={[0, 0, 2]}
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
        <Flex
          w="85%"
          maxW={1445}
          mx="auto"
          alignItems="center"
          justifyContent="space-between"
        >
          <NextLink href="/">
            <Text fontSize="2xl" ml="8" fontWeight="bold" cursor="pointer">
              HMX
            </Text>
          </NextLink>

          <HStack spacing={{ base: "0", md: "6" }}>
            <Flex alignItems={"center"}>
              <Menu>
                <MenuButton
                  py={2}
                  transition="all 0.3s"
                  _focus={{ boxShadow: "none" }}
                >
                  <HStack>
                    <Avatar size={"sm"} src={user?.photo?.secure_url} />
                    <VStack
                      display={{ base: "none", md: "flex" }}
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2"
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                      >{`${user?.firstName} ${user?.lastName}`}</Text>
                      <Text
                        fontSize="xs"
                        color="gray.800"
                        fontWeight="semibold"
                      >
                        Admin
                      </Text>
                    </VStack>
                    <Box display={{ base: "none", md: "flex" }}>
                      <FiChevronDown />
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList
                  bg={useColorModeValue("white", "gray.900")}
                  borderColor={useColorModeValue("gray.200", "gray.700")}
                >
                  <NextLink href="/my-account/profile">
                    <MenuItem>Profile</MenuItem>
                  </NextLink>
                  <MenuItem>Settings</MenuItem>
                  <MenuItem>Billing</MenuItem>
                  <MenuDivider />
                  <MenuItem>Sign out</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </HStack>
        </Flex>
      </Box>
      <Box w={["100%", "100%", "85%"]} maxW={1445} mx="auto">
        <Sidebar>
          <Box flex={1}>{children}</Box>
        </Sidebar>
      </Box>
    </>
  );
};

export default AdminLayout;
