import Nav from "../components/Nav";
import { Box } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <Box>
      <Nav />
      <Box w={["100%", "90%", "85%"]} mx="auto" minH="75vh" mt="2%">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
