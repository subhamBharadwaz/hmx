import Nav from "../components/Nav";
import { Box } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <Box>
      <Nav />
      <Box>{children}</Box>
    </Box>
  );
};

export default Layout;
