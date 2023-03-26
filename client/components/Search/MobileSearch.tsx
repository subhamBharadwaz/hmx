import React, { useState } from "react";
import {
  Input,
  InputLeftElement,
  InputGroup,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
} from "@chakra-ui/react";

import { AiOutlineSearch } from "react-icons/ai";
import { useRouter } from "next/router";

const MobileSearch = ({ onClose, isOpen }) => {
  const [searchedValue, setSearchedValue] = useState("");

  const router = useRouter();

  const handleQueryChange = (e) => {
    setSearchedValue(e.target.value);
  };

  const handleSearchQuery = () => {
    if (searchedValue.length) {
      router.push({
        pathname: "/search",
        query: { q: searchedValue },
      });
      setSearchedValue("");
      onClose();
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent borderRadius="none" boxShadow="none" bg="transparent">
        <ModalBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchQuery();
            }}
          >
            <HStack
              bg="white"
              borderRadius={10}
              px={3}
              py={2}
              alignItems="center"
              justifyContent="space-around"
            >
              <IconButton
                type="submit"
                variant="unstyled"
                colorScheme="blue"
                aria-label="Search database"
                icon={<AiOutlineSearch />}
                size="lg"
                color="blue.400"
              />

              <Input
                type="search"
                placeholder="What are you looking for?"
                value={searchedValue}
                fontSize={16}
                onChange={handleQueryChange}
                focusBorderColor="transparent"
                borderColor="transparent"
                _hover={{ borderColor: "transparent" }}
                _focus={{ boxShadow: "none" }}
                _active={{ boxShadow: "none" }}
              />
            </HStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MobileSearch;
