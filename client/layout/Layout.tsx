import { Box } from "@chakra-ui/react";

import Nav from "../components/Nav";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <Box>
      <Nav />

      <Box w={["95%", "95%", "85%"]} mx="auto" minH="75vh" mt="2%">
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
