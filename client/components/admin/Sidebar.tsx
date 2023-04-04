import { ReactNode } from "react";
import {
  Box,
  Flex,
  Text,
  Link,
  FlexProps,
  Icon,
  IconButton,
  BoxProps,
  useDisclosure,
  Drawer,
  CloseButton,
  DrawerContent,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  HStack,
  Avatar,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

// Icons
import { FiMenu, FiChevronDown, FiBell } from "react-icons/fi";
import {
  MdOutlineDashboard,
  MdStoreMallDirectory,
  MdOutlineDeliveryDining,
  MdQueryStats,
  MdOutlineNotificationAdd,
  MdOutlinePsychology,
  MdSettingsApplications,
} from "react-icons/md";
import {
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineLogout,
} from "react-icons/ai";
import { BiUserCircle } from "react-icons/bi";
import { IconType } from "react-icons";
import { BsChevronDown } from "react-icons/bs";

interface LinkItemProps {
  name: string;
  icon: IconType;
}
interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  {
    name: "Dashboard",
    icon: MdOutlineDashboard,
    path: "/admin",
  },
  {
    name: "Users",
    icon: AiOutlineUser,
    path: "/admin/users",
  },
  {
    name: "Products",
    icon: MdStoreMallDirectory,
    path: "/admin/products",
  },
  {
    name: "Orders",
    icon: AiOutlineShoppingCart,
    path: "/admin/orders",
  },
  {
    name: "Delivery",
    icon: MdOutlineDeliveryDining,
    path: "/admin/delivery",
  },
  {
    name: "Stats",
    icon: MdQueryStats,
    path: "/admin/stats",
  },
  {
    name: "Notification",
    icon: MdOutlineNotificationAdd,
    path: "/admin/notifications",
  },
  {
    name: "Logs",
    icon: MdOutlinePsychology,
    path: "/admin/logs",
  },
  {
    name: "Settings",
    icon: MdSettingsApplications,
    path: "/admin/settings",
  },
  {
    name: "Profile",
    icon: BiUserCircle,
    path: "/admin/profile",
  },
  { name: "Logout", icon: AiOutlineLogout, path: "/" },
];

export default function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const ScrollableBox = styled(Box)`
    /* Customize scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: ${useColorModeValue("gray.100", "gray.800")};
    }

    ::-webkit-scrollbar-thumb {
      background: ${useColorModeValue("gray.300", "gray.600")};
      border-radius: 8px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${useColorModeValue("gray.400", "gray.700")};
    }
  `;

  return (
    <ScrollableBox
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      overflow="auto"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          HMX Admin
        </Text>
        <CloseButton
          size="lg"
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
        />
      </Flex>

      <Box minH="100vh">
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            path={link.path}
            icon={link.icon}
            onClick={onClose}
          >
            {link.name}
          </NavItem>
        ))}
      </Box>
    </ScrollableBox>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  path: string;
  children?;
}
const NavItem = ({ icon, path, children, ...rest }: NavItemProps) => {
  const router = useRouter();

  return (
    <NextLink href={path} passHref>
      <Link
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
        fontSize="lg"
        color="blackAlpha.900"
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="md"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "blue.50",
            color: "darkblue",
          }}
          bg={router.pathname === path ? "blue.50" : ""}
          color={router.pathname === path ? "darkblue" : ""}
          fontWeight={router.pathname === path ? "semibold" : ""}
          {...rest}
        >
          {icon && (
            <Icon
              mr="4"
              _groupHover={{
                color: "darkblue",
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Link>
    </NextLink>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

export const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      background="whiteAlpha.400"
      boxShadow="rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;"
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        ml="8"
        fontWeight="bold"
      >
        HMX Admin
      </Text>
      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
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
                  <Text fontSize="xs" color="gray.800" fontWeight="semibold">
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
              <MenuItem>
                <NextLink href="/my-account/profile">Profile</NextLink>
              </MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
