import React from "react";
import {
  Box,
  Flex,
  Divider,
  Text,
  Link,
  FlexProps,
  Icon,
  BoxProps,
  CloseButton,
  useMediaQuery,
  Show,
  Hide,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { If, Then, Else } from "react-if";

// Icons
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
import { FiMenu, FiChevronDown, FiBell } from "react-icons/fi";
import { IconType } from "react-icons";

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

export const Sidebar = () => {
  const [mobileView] = useMediaQuery("(min-width:769px)");
  return (
    <Box
      flex={1}
      minH="100vh"
      boxShadow="0 4px 12px rgba(0,0,0,0.05)"
      py={4}
      pos="sticky"
      top="0"
      minW="350px"
    >
      <Box h={50}>
        <Flex alignItems="center" justifyContent="center">
          <Text as="span" fontSize={30} fontWeight="bold" color="green.500">
            HMX Admin
          </Text>
        </Flex>
      </Box>
      <Divider />
      <Box className="center" pl={10}>
        {LinkItems.map((link) => (
          <NavItem key={link.name} path={link.path} icon={link.icon}>
            {link.name}
          </NavItem>
        ))}
      </Box>
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
