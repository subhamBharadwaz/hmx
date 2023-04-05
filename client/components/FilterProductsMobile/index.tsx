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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

import { AppDispatch } from "../../store";

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

const FilterProductsMobile = ({
  productGender,
  productCategory,
  searchQuery,
  onClose,
  isOpen,
  action,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [showGenders, setShowGenders] = useState(false);
  const [selectedGenders, setSelectedGenders] = useState([productGender]);
  const [sortDirection, setSortDirection] = useState("");

  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([
    productCategory,
  ]);

  const [showSizes, setShowSizes] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showPrices, setShowPrices] = useState(false);
  const [sliderValue, setSliderValue] = useState([499, 3999]);
  const [showSort, setShowSort] = useState(false);

  const handleApplyFilters = () => {
    dispatch(
      action({
        category: selectedCategories,
        size: selectedSizes,
        page: "1",
        gender: selectedGenders,
        search: searchQuery,
        minPrice: sliderValue[0],
        maxPrice: sliderValue[1],
        sortDirection,
      })
    );
    onClose();
  };
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
      action({
        category: [],
        size: [],
        page: "1",
        gender: productGender,
        minPrice: 499,
        maxPrice: 3999,
        sortDirection: null,
      })
    );
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedSizes([]);
    setShowCategories(false);
    setShowGenders(false);
    setShowSizes(false);
    setShowPrices(false);
    setShowSort(false);

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Filters</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            as={motion.div}
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            my={30}
            w="85%"
            mx="auto"
          >
            <Stack>
              <Stack borderBottom="1px" pb={5} borderColor="blackAlpha.300">
                <HStack
                  justifyContent="space-between"
                  cursor="pointer"
                  onClick={() => setShowCategories(!showCategories)}
                >
                  <Text fontSize="md" fontWeight="semibold">
                    CATEGORY
                  </Text>
                  <Text fontSize="xl" fontWeight="semibold">
                    {showCategories ? <AiOutlineMinus /> : <AiOutlinePlus />}
                  </Text>
                </HStack>

                {showCategories && (
                  <CheckboxGroup
                    colorScheme="messenger"
                    value={selectedCategories}
                  >
                    {categories.map((category) => (
                      <Checkbox
                        value={category}
                        key={category}
                        onChange={handleCategory}
                      >
                        {category}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                )}
              </Stack>
              <Stack borderBottom="1px" pb={5} borderColor="blackAlpha.300">
                <HStack
                  justifyContent="space-between"
                  cursor="pointer"
                  onClick={() => setShowGenders(!showGenders)}
                >
                  <Text fontSize="md" fontWeight="semibold">
                    GENDER
                  </Text>
                  <Text fontSize="xl" fontWeight="semibold">
                    {showCategories ? <AiOutlineMinus /> : <AiOutlinePlus />}
                  </Text>
                </HStack>
                {showGenders && (
                  <CheckboxGroup
                    colorScheme="messenger"
                    value={selectedGenders}
                  >
                    {gender.map((gen) => (
                      <Checkbox value={gen} key={gen} onChange={handleGender}>
                        {gen}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                )}
              </Stack>

              <Stack borderBottom="1px" pb={5} borderColor="blackAlpha.300">
                <HStack
                  justifyContent="space-between"
                  cursor="pointer"
                  onClick={() => setShowSizes(!showSizes)}
                >
                  <Text fontSize="md" fontWeight="semibold">
                    SIZES
                  </Text>
                  <Text fontSize="xl" fontWeight="semibold">
                    {showCategories ? <AiOutlineMinus /> : <AiOutlinePlus />}
                  </Text>
                </HStack>
                {showSizes && (
                  <CheckboxGroup colorScheme="messenger" value={selectedSizes}>
                    {sizes.map((size) => (
                      <Checkbox value={size} key={size} onChange={handleSize}>
                        {size}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                )}
              </Stack>
              <Stack
                spacing={10}
                borderBottom="1px"
                pb={5}
                borderColor="blackAlpha.300"
              >
                <HStack
                  justifyContent="space-between"
                  cursor="pointer"
                  onClick={() => setShowPrices(!showPrices)}
                >
                  <Text fontSize="md" fontWeight="semibold">
                    PRICES
                  </Text>
                  <Text fontSize="xl" fontWeight="semibold">
                    {showCategories ? <AiOutlineMinus /> : <AiOutlinePlus />}
                  </Text>
                </HStack>
                {showPrices && (
                  <RangeSlider
                    // eslint-disable-next-line jsx-a11y/aria-proptypes
                    aria-label={["min", "max"]}
                    defaultValue={[499, 3999]}
                    colorScheme="messenger"
                    min={499}
                    max={3999}
                    onChange={(val) => setSliderValue(val)}
                  >
                    <RangeSliderMark
                      value={sliderValue[0]}
                      textAlign="center"
                      bg="blue.500"
                      color="white"
                      mt="-10"
                      ml="-5"
                      w="12"
                      rounded={5}
                    >
                      {sliderValue[0]}
                    </RangeSliderMark>
                    <RangeSliderMark
                      value={sliderValue[1]}
                      textAlign="center"
                      bg="blue.500"
                      color="white"
                      mt="-10"
                      ml="-5"
                      w="12"
                    >
                      {sliderValue[1]}
                    </RangeSliderMark>
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb boxSize={6} index={0}></RangeSliderThumb>
                    <RangeSliderThumb boxSize={6} index={1}></RangeSliderThumb>
                  </RangeSlider>
                )}
              </Stack>
              <Stack>
                <HStack
                  justifyContent="space-between"
                  cursor="pointer"
                  onClick={() => setShowSort(!showSort)}
                >
                  <Text fontSize="md" fontWeight="semibold">
                    SORT
                  </Text>
                  <Text fontSize="xl" fontWeight="semibold">
                    {showCategories ? <AiOutlineMinus /> : <AiOutlinePlus />}
                  </Text>
                </HStack>
                {showSort && (
                  <RadioGroup>
                    <Stack>
                      <Radio
                        value="desc"
                        checked={sortDirection === "desc"}
                        onChange={(e) => setSortDirection(e.target.value)}
                      >
                        Price - High To Low
                      </Radio>
                      <Radio
                        value="asc"
                        checked={sortDirection === "asc"}
                        onChange={(e) => setSortDirection(e.target.value)}
                      >
                        {" "}
                        Price - Low To High
                      </Radio>
                    </Stack>
                  </RadioGroup>
                )}
              </Stack>
            </Stack>
          </Box>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup spacing={5}>
            <Button onClick={handleClearFilters} variant="outline">
              Clear Filters
            </Button>
            <Button onClick={handleApplyFilters} colorScheme="messenger">
              Apply
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FilterProductsMobile;
