import Nav from "../components/Nav";
import { Box } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <Box>
      <Nav />
      <Box w={["100%", "80%", "80%"]} mx="auto">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
