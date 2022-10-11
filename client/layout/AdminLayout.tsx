import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../components/admin/Sidebar";

import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <Box w={["100%", "80%", "80%"]} mx="auto">
      <Sidebar>
        <Box flex={1} py={7} w="90%" mx="auto">
          {children}
        </Box>
      </Sidebar>
    </Box>
  );
};

export default AdminLayout;
