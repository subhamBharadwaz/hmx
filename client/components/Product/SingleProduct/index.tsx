import React from "react";
import { IProduct } from "../../../types/product";
import {
  Box,
  Flex,
  HStack,
  Stack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Radio,
  RadioGroup,
  useRadioGroup,
} from "@chakra-ui/react";
import NextImage from "next/image";
import SizeRadioCard from "./SizeRadioCard";

interface Product {
  product: IProduct;
}

const SingleProduct = ({ product }: Product) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "size",
    defaultValue: "M",
    onChange: console.log,
  });

  const group = getRootProps();

  return (
    <Flex w="100%" justifyContent="space-between">
      <Box w="45%">
        <Flex align="center" wrap="wrap" gap={5}>
          {product?.photos?.map((photo) => (
            <Box key={photo?.id}>
              <NextImage
                src={photo?.secure_url}
                alt={product?.name}
                width={250}
                height={300}
                objectFit="cover"
              />
            </Box>
          ))}
        </Flex>
      </Box>
      <Stack w="50%" gap={5}>
        <Stack>
          <Text fontSize="3xl" as="b">
            {product?.name}
          </Text>
          <Text fontSize="md" fontWeight="medium" color="blackAlpha.500">
            {product?.category}
          </Text>
          <Text
            fontSize="xl"
            as="b"
            letterSpacing={1.1}
          >{`₹${product?.price}`}</Text>
          <Stack gap={3}>
            <Text as="b" fontSize="md">
              Please select a size.
            </Text>
            <HStack {...group}>
              {product?.size?.map((value) => {
                const radio = getRadioProps({ value });
                return (
                  <SizeRadioCard key={value} {...radio}>
                    {value}
                  </SizeRadioCard>
                );
              })}
            </HStack>
          </Stack>
        </Stack>

        <Accordion
          defaultIndex={[0]}
          allowMultiple
          border="1px"
          borderColor="blackAlpha.200"
        >
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box
                  as="b"
                  flex="1"
                  fontSize="lg"
                  textAlign="left"
                  color="blackAlpha.700"
                >
                  Product Description
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} color="blackAlpha.700" lineHeight={1.7}>
              {product?.description}
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Section 2 title
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
    </Flex>
  );
};

export default SingleProduct;
