import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../../components/user/admin/Sidebar";

export default function AdminDashboard() {
  return (
    <>
      <Flex>
        <Box maxW={300} flex={1}>
          <Sidebar />
        </Box>
        <Box minW="65vw">main</Box>
      </Flex>
    </>
  );
}
