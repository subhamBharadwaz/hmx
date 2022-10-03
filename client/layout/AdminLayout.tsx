import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../components/user/admin/Sidebar";

import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <>
      <Flex w={["100%", "80%", "80%"]} mx="auto">
        <Box mr={3}>
          <Sidebar />
        </Box>

        <Box flex={1} py={7}>
          {children}
        </Box>
      </Flex>
    </>
  );
};

export default AdminLayout;
