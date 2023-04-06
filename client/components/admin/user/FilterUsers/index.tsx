import { useEffect, useState } from "react";
import {
  Stack,
  Text,
  Checkbox,
  CheckboxGroup,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderMark,
  Radio,
  RadioGroup,
  Button,
  ButtonGroup,
  HStack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { BsChevronDown } from "react-icons/bs";

import { AppDispatch } from "../../../../store";
import { getAllUsers } from "../../../../store/services/admin/adminUserSlice";

const roles = ["user", "admin"];

const FilterUsers = () => {
  const [selectedUserRoles, setSelectedUserRoles] = useState(["All"]);
  const dispatch = useDispatch<AppDispatch>();

  const handleApplyFilters = () => {
    dispatch(
      getAllUsers({
        role: selectedUserRoles,
        page: "1",
      })
    );
  };

  const handleClearFilters = () => {
    dispatch(
      getAllUsers({
        role: [],
        page: "1",
      })
    );
    setSelectedUserRoles([]);
  };

  const handleRole = (e) => {
    const value: string = e.target.value;
    const isChecked: boolean = e.target.checked;

    setSelectedUserRoles(
      isChecked
        ? [...selectedUserRoles, value]
        : selectedUserRoles.filter((item) => item !== value)
    );
  };
  return (
    <Box>
      <Menu closeOnSelect={false}>
        <MenuButton
          as={Button}
          colorScheme="messenger"
          rightIcon={<BsChevronDown />}
        >
          Filter
        </MenuButton>
        <MenuList>
          <MenuOptionGroup title="Role">
            <MenuDivider />
            <CheckboxGroup colorScheme="messenger" value={selectedUserRoles}>
              {roles.map((role) => (
                <MenuItem key={role}>
                  <Checkbox value={role} onChange={handleRole}>
                    {role}
                  </Checkbox>
                </MenuItem>
              ))}
            </CheckboxGroup>
          </MenuOptionGroup>
          <MenuDivider />

          <MenuItem>
            <Stack>
              <ButtonGroup size="sm" w="100%">
                <Button
                  onClick={handleClearFilters}
                  colorScheme="gray"
                  variant="outline"
                >
                  Clear Filters
                </Button>
                <Button onClick={handleApplyFilters} colorScheme="messenger">
                  Apply Filters
                </Button>
              </ButtonGroup>
            </Stack>
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default FilterUsers;
