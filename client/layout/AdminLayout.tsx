import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../components/admin/Sidebar";

import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <Box>
      <Sidebar>
        <Box flex={1}>{children}</Box>
      </Sidebar>
    </Box>
  );
};

export default AdminLayout;
