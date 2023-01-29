import React from "react";
import { IProduct } from "../../../types/product";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Stack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import NextImage from "next/image";

interface Product {
  product: IProduct;
}

const SingleProduct = ({ product }: Product) => {
  return (
    <Box>
      <Flex justifyContent="space-between" wrap="wrap">
        <Flex w="40%" gap={5}>
          {product?.photos?.map((photo) => (
            <NextImage
              key={photo?.id}
              src={photo?.secure_url}
              alt={product?.name}
              width={500}
              height={600}
            />
          ))}
        </Flex>
        <Stack w="50%">
          <Stack>
            <Text fontSize="2xl" as="b" color="blackAlpha.800">
              {product?.name}
            </Text>
            <Text fontSize="lg" color="blackAlpha.500">
              {product?.category}
            </Text>
            <Text fontSize="xl" as="b">{`₹${product?.price}`}</Text>
          </Stack>
          <HStack>
            {product?.size?.map((s, idx) => (
              <Text key={idx}>{s}</Text>
            ))}
          </HStack>
          <Accordion
            defaultIndex={[0]}
            allowMultiple
            border="1px"
            borderColor="gray.200"
          >
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="b" flex="1" textAlign="left" fontSize="lg">
                    Product Details
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel lineHeight={1.7} color="gray.600" pb={4}>
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
    </Box>
  );
};

export default SingleProduct;
