import { useEffect, useState } from "react";
import {
  Text,
  Checkbox,
  CheckboxGroup,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { BsChevronDown } from "react-icons/bs";
import { AiOutlineFilter } from "react-icons/ai";

import { AppDispatch } from "../../../../store";
import { getAllProducts } from "../../../../store/services/admin/adminProductSlice";
import FilterProductsMobile from "../../../FilterProductsMobile";

const categories = [
  "Twill Jogger",
  "Shirred Jogger",
  "Motoknit Jogger",
  "Dropcrotch Jogger",
  "Hiphop Jogger",
  "Shadingblock Jogger",
  "Chino Jogger",
  "Handcuffed Jogger",
  "Loosepocket Jogger",
  "Splashcolor Jogger",
  "Wool Jogger",
  "Distressed Jogger",
  "Noncuffed Jogger",
];

const gender = ["Men", "Women", "Unisex"];
const sizes = ["S", "M", "L", "XL", "XXL"];

const FilterProducts = ({ productGender, productCategory, searchQuery }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedGenders, setSelectedGenders] = useState([productGender]);
  const [selectedCategories, setSelectedCategories] = useState([
    productCategory,
  ]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  useEffect(() => {
    dispatch(
      getAllProducts({
        category: selectedCategories,
        size: selectedSizes,
        page: "1",
        gender: selectedGenders,
        search: searchQuery,
      })
    );
  }, [
    dispatch,
    searchQuery,
    selectedCategories,
    selectedGenders,
    selectedSizes,
  ]);

  const handleCategory = (e) => {
    const value: string = e.target.value;
    const isChecked: boolean = e.target.checked;

    setSelectedCategories(
      isChecked
        ? [...selectedCategories, value]
        : selectedCategories.filter((item) => item !== value)
    );
  };

  const handleSize = (e) => {
    const value: string = e.target.value;
    const isChecked: boolean = e.target.checked;
    setSelectedSizes(
      isChecked
        ? [...selectedSizes, value]
        : selectedSizes.filter((item) => item !== value)
    );
  };
  const handleGender = (e) => {
    const value: string = e.target.value;
    const isChecked: boolean = e.target.checked;
    setSelectedGenders(
      isChecked
        ? [...selectedGenders, value]
        : selectedGenders.filter((item) => item !== value)
    );
  };

  const handleClearFilters = () => {
    dispatch(
      getAllProducts({
        category: [],
        size: [],
        page: "1",
        gender: productGender,
      })
    );
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedSizes([]);
  };

  return (
    <>
      <Stack display={["none", "none", "flex"]} direction="row" spacing={5}>
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            colorScheme="gray"
            variant="outline"
            size="sm"
            rightIcon={<BsChevronDown />}
          >
            Category
          </MenuButton>
          <MenuList
            bg="white"
            border="1px solid gray"
            borderRadius="md"
            boxShadow="md"
            zIndex={2}
          >
            <CheckboxGroup colorScheme="messenger" value={selectedCategories}>
              {categories.map((category) => (
                <MenuItem key={category}>
                  <Checkbox value={category} onChange={handleCategory}>
                    {category}
                  </Checkbox>
                </MenuItem>
              ))}
            </CheckboxGroup>
          </MenuList>
        </Menu>
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            colorScheme="gray"
            variant="outline"
            size="sm"
            rightIcon={<BsChevronDown />}
          >
            Size
          </MenuButton>
          <MenuList
            bg="white"
            border="1px solid gray"
            borderRadius="md"
            boxShadow="md"
            zIndex={2}
          >
            <CheckboxGroup colorScheme="messenger" value={selectedSizes}>
              {sizes.map((size) => (
                <MenuItem key={size}>
                  <Checkbox value={size} onChange={handleSize}>
                    {size}
                  </Checkbox>
                </MenuItem>
              ))}
            </CheckboxGroup>
          </MenuList>
        </Menu>
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            colorScheme="gray"
            variant="outline"
            size="sm"
            rightIcon={<BsChevronDown />}
          >
            Gender
          </MenuButton>
          <MenuList
            bg="white"
            border="1px solid gray"
            borderRadius="md"
            boxShadow="md"
            zIndex={2}
          >
            <CheckboxGroup colorScheme="messenger" value={selectedGenders}>
              {gender.map((g) => (
                <MenuItem key={g}>
                  <Checkbox value={g} onChange={handleGender}>
                    {g}
                  </Checkbox>
                </MenuItem>
              ))}
            </CheckboxGroup>
          </MenuList>
        </Menu>
        <Button size="sm" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </Stack>
      <Box display={["block", "block", "none"]}>
        {" "}
        <Button
          colorScheme="messenger"
          variant="outline"
          onClick={onOpen}
          leftIcon={<AiOutlineFilter />}
        >
          Filter
        </Button>
        <FilterProductsMobile
          productCategory="All"
          productGender="All"
          searchQuery=""
          onClose={onClose}
          isOpen={isOpen}
          action={getAllProducts}
        />
      </Box>
    </>
  );
};

export default FilterProducts;
