import React, { useState } from "react";
import {
  Input,
  InputLeftElement,
  InputGroup,
  IconButton,
  Box,
} from "@chakra-ui/react";

import { AiOutlineSearch } from "react-icons/ai";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../store";
import { getAllUsers } from "../../../../store/services/admin/adminUserSlice";

const SearchUsers = () => {
  const [searchedValue, setSearchedValue] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const handleQueryChange = (e) => {
    setSearchedValue(e.target.value);
  };

  const handleSearchQuery = () => {
    dispatch(getAllUsers({ searchQ: searchedValue }));
  };
  return (
    <Box w={350}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchQuery();
        }}
      >
        <InputGroup>
          <InputLeftElement m="2%">
            <IconButton
              type="submit"
              variant="unstyled"
              colorScheme="blue"
              aria-label="Search database"
              icon={<AiOutlineSearch />}
              size="sm,"
            />
          </InputLeftElement>
          <Input
            type="search"
            placeholder="Search users by role, name or email"
            value={searchedValue}
            onChange={handleQueryChange}
            flexGrow="1"
            m="2%"
          />
        </InputGroup>
      </form>
    </Box>
  );
};

export default SearchUsers;
