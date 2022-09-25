import React from "react";
import {
  Box,
  List,
  ListItem,
  ListIcon,
  Flex,
  Divider,
  Text,
} from "@chakra-ui/react";

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

const Sidebar = () => {
  return (
    <Box
      flex={1}
      minH="100vh"
      sx={{ borderRight: "0.5px solid rgb(230,227,227)" }}
      py={4}
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
        <List>
          <p className="title">MAIN</p>
          <ListItem p="5px" cursor="pointer">
            <ListIcon as={MdOutlineDashboard} color="green.500" fontSize={20} />
            Dashboard
          </ListItem>

          <p className="title">LISTS</p>
          <ListItem p="5px" cursor="pointer">
            <ListIcon as={AiOutlineUser} color="green.500" fontSize={20} />
            Users
          </ListItem>
          <ListItem p="5px" cursor="pointer">
            <ListIcon
              as={MdStoreMallDirectory}
              color="green.500"
              fontSize={20}
            />
            Products
          </ListItem>
          <ListItem p="5px" cursor="pointer">
            <ListIcon
              as={AiOutlineShoppingCart}
              color="green.500"
              fontSize={20}
            />
            Orders
          </ListItem>
          <ListItem p="5px" cursor="pointer">
            <ListIcon
              as={MdOutlineDeliveryDining}
              color="green.500"
              fontSize={20}
            />
            Delivery
          </ListItem>
          <p className="title">USEFUL</p>
          <ListItem p="5px" cursor="pointer">
            <ListIcon as={MdQueryStats} color="green.500" fontSize={20} />
            Stats
          </ListItem>
          <ListItem p="5px" cursor="pointer">
            <ListIcon
              as={MdOutlineNotificationAdd}
              color="green.500"
              fontSize={20}
            />
            Notifications
          </ListItem>
          <p className="title">SERVICE</p>

          <ListItem p="5px" cursor="pointer">
            <ListIcon
              as={MdOutlinePsychology}
              color="green.500"
              fontSize={20}
            />
            Logs
          </ListItem>
          <ListItem p="5px" cursor="pointer">
            <ListIcon
              as={MdSettingsApplications}
              color="green.500"
              fontSize={20}
            />
            Settings
          </ListItem>
          <p className="title">USER</p>
          <ListItem p="5px" cursor="pointer">
            <ListIcon as={BiUserCircle} color="green.500" fontSize={20} />
            Profile
          </ListItem>
          <ListItem p="5px" cursor="pointer">
            <ListIcon as={AiOutlineLogout} color="green.500" fontSize={20} />
            Logout
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
