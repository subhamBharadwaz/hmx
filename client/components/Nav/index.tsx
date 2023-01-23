import {
  Box,
  Container,
  Flex,
  List,
  ListItem,
  HStack,
  Text,
} from "@chakra-ui/react";

const Nav = () => {
  return (
    <Box bg="aqua" minW="100vw" minH={20} py={5}>
      <Flex
        w={["100%", "80%", "80%"]}
        mx="auto"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize="2xl">HMX</Text>
        <List fontSize={18} fontWeight="semibold">
          <HStack spacing={10}>
            <ListItem>Men</ListItem>
            <ListItem>Women</ListItem>
          </HStack>
        </List>
        <List fontSize={18} fontWeight="semibold">
          <HStack spacing={10}>
            <ListItem>Login</ListItem>
            <ListItem>Fav</ListItem>
            <ListItem>Cart</ListItem>
          </HStack>
        </List>
      </Flex>
    </Box>
  );
};

export default Nav;
