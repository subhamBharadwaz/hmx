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
import { AppDispatch } from "../../../../store";
import { getAllUsers } from "../../../../store/services/admin/adminUserSlice";
import { BsChevronDown } from "react-icons/bs";

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
    <Box zIndex={100}>
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
            <Button
              size="sm"
              colorScheme="messenger"
              w="100%"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default FilterUsers;
