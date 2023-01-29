import { Box, useRadio } from "@chakra-ui/react";

const SizeRadioCard = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "blackAlpha.900",
          color: "white",
          borderColor: "blue.500",
          fontWeight: "bold",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        _hover={{
          border: "1px",
          borderColor: "blue.500",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
};
export default SizeRadioCard;
