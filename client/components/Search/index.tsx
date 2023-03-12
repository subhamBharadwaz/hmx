import React, { useState } from "react";
import {
  Input,
  InputLeftElement,
  InputGroup,
  IconButton,
} from "@chakra-ui/react";

import { AiOutlineSearch } from "react-icons/ai";
import { useRouter } from "next/router";

const SearchInput = ({}) => {
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
    }
  };
  return (
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
          placeholder="What are you looking for?"
          value={searchedValue}
          onChange={handleQueryChange}
          flexGrow="1"
          m="2%"
        />
      </InputGroup>
    </form>
  );
};

export default SearchInput;
