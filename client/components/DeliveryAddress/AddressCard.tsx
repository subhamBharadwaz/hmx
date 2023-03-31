import React from "react";
import { Box, Text, Flex, Button, ButtonGroup } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { removeShippingAddress } from "../../store/services/address/addressSlice";

const AddressCard = ({ shippingAddress, onOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Box p={3} border="1px" borderColor="blue.400" borderRadius={5}>
      <Text
        fontSize="lg"
        fontWeight="bold"
      >{`${shippingAddress?.firstName} ${shippingAddress?.lastName}`}</Text>
      <Box my={3}>
        <Text>{`${shippingAddress?.streetName}, ${shippingAddress?.landMark}`}</Text>
        <Text>{`${shippingAddress?.city} ${shippingAddress?.postalCode}`}</Text>
      </Box>
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="sm" color="blackAlpha.600">
          default address
        </Text>
        <ButtonGroup>
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            onClick={() => dispatch(removeShippingAddress())}
          >
            REMOVE
          </Button>
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            onClick={onOpen}
          >
            EDIT
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

export default AddressCard;
