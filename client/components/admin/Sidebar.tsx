import React, { ReactNode } from "react";
import {
  Box,
  Flex,
  Divider,
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
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

// Icons
import { FiMenu } from "react-icons/fi";
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

export const Sidebar = ({ children }: { children: ReactNode }) => {
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
      <Box ml={{ base: 0, md: 300 }} p="4">
        {children}
      </Box>
    </Box>
  );
};

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      flex={1}
      h="full"
      boxShadow="0 4px 12px rgba(0,0,0,0.05)"
      py={4}
      pos="fixed"
      w={{ base: "full", md: 300 }}
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text as="span" fontSize={30} fontWeight="bold" color="green.500">
          HMX Admin
        </Text>
        <CloseButton
          size="lg"
          display={{ base: "flex", md: "none" }}
          onClick={onClose}
        />
      </Flex>

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
  );
};

export default Sidebar;

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
        fontSize="20"
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

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      borderBottomWidth="1px"
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontWeight="bold">
        HMX Admin
      </Text>
    </Flex>
  );
};
