import React from "react";
import { IOrder } from "../../../../types/order";
import {
  Box,
  Flex,
  Text,
  Stack,
  HStack,
  Divider,
  Badge,
} from "@chakra-ui/react";
import NextImage from "next/image";

import { AiFillStar } from "react-icons/ai";
import { BsChevronRight } from "react-icons/bs";

import NextLink from "next/link";

interface IOrderDetails {
  order: IOrder;
}

const SingleOrderDetails = ({ order }: IOrderDetails) => {
  const { shippingInfo, shippingAmount, totalAmount, taxAmount } = order;
  return (
    <>
      <Flex
        justifyContent="space-between"
        flexDirection={["column", "column", "row"]}
        gap={10}
      >
        <Box minW="60%">
          <HStack justifyContent="space-between" mb={5}>
            <Text color="blackAlpha.600" fontWeight="bold" fontSize="sm">
              ORDER# <span className="text-bold">{order._id}</span>
            </Text>
            <Text color="blackAlpha.600" fontWeight="bold" fontSize="sm">
              ORDER PLACED{" "}
              <span className="text-bold"> 7th Aug 22 08:40 PM</span>
            </Text>
          </HStack>

          <Box border="1px" borderColor="gray.300" my={4} pos="relative">
            {order?.orderItems?.map((item, idx) => (
              <Box
                key={item._id}
                className={
                  idx !== order?.orderItems?.length - 1 ? "cardMb" : ""
                }
              >
                <Flex>
                  <Box h="285px" w="25%" position="relative">
                    <NextImage
                      src={item?.image}
                      alt={item?.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </Box>

                  <Stack ml={5} p={5}>
                    <Badge
                      fontSize="md"
                      colorScheme={
                        order?.orderStatus === "Delivered"
                          ? "green"
                          : order?.orderStatus === "Processing"
                          ? "yellow"
                          : "cyan"
                      }
                    >
                      {order?.orderStatus}
                    </Badge>
                    <Text fontSize="md" fontWeight="semibold">
                      {item?.name}
                    </Text>
                    <Text
                      mt={3}
                      fontSize="md"
                      color="gray.400"
                      fontWeight="semibold"
                    >
                      Size: {item?.size}
                    </Text>
                    <Text mt={3} fontSize="md" fontWeight="semibold">
                      Rs. {item?.price}
                    </Text>
                  </Stack>
                </Flex>
              </Box>
            ))}
          </Box>
          <Stack
            spacing={6}
            border="1px"
            borderColor="blackAlpha.300"
            cursor="pointer"
            px={10}
            py={15}
          >
            <Text fontSize="md" fontWeight="bold" color="blackAlpha.300">
              NEED HELP WITH YOUR ORDER?
            </Text>
            <NextLink href="/review-your-purchases">
              <HStack justifyContent="space-between" alignItems="center">
                <HStack>
                  <Text fontSize="md" color="messenger.700">
                    Write a Product review{" "}
                  </Text>
                  <HStack>
                    <AiFillStar color="orange" />
                    <AiFillStar color="orange" />
                    <AiFillStar color="orange" />
                    <AiFillStar color="orange" />
                  </HStack>
                </HStack>
                <BsChevronRight />
              </HStack>
            </NextLink>
            <Divider />
            <NextLink href="#">
              <Text fontSize="md" color="messenger.700">
                Help and Support
              </Text>
            </NextLink>
          </Stack>
        </Box>
        <Box minW="30%">
          <Box
            mx="auto"
            border="1px"
            borderColor="gray.300"
            my={4}
            p={5}
            pos="relative"
          >
            <Stack spacing={3}>
              <Text fontSize="md" fontWeight="bold" color="blackAlpha.500">
                SHIPPING DETAILS
              </Text>
              <HStack justifyContent="space-between">
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                >{`${shippingInfo?.firstName} ${shippingInfo?.lastName}`}</Text>
                <Text
                  bg="blackAlpha.300"
                  fontSize="xs"
                  fontWeight="bold"
                  rounded={10}
                  py={1}
                  px={3}
                >
                  Home
                </Text>
              </HStack>
              <Text
                fontSize="xs"
                fontWeight="medium"
              >{`${shippingInfo?.houseNo} ${shippingInfo?.streetName},${shippingInfo?.city} ${shippingInfo?.postalCode},${shippingInfo?.state},${shippingInfo?.country}`}</Text>
            </Stack>
          </Box>
          <Box mx="auto" border="1px" borderColor="gray.300" pos="relative">
            <Stack p={5}>
              <Text fontSize="md" fontWeight="bold" color="blackAlpha.500">
                PAYMENT SUMMARY
              </Text>
              <HStack justifyContent="space-between">
                <Text fontSize="sm">Cart Total</Text>
                <Text fontSize="sm">₹ {totalAmount}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text fontSize="sm">Tax Amount</Text>
                <Text fontSize="sm">₹ {taxAmount}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text fontSize="sm">Shipping Amount</Text>
                <Text fontSize="sm">₹ {shippingAmount}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text fontSize="sm">Order Total</Text>
                <Text fontSize="sm">₹ {totalAmount}</Text>
              </HStack>
            </Stack>
            <Divider />
            <HStack justifyContent="space-between" p={5}>
              <Text fontSize="md" fontWeight="bold">
                Amount Paid
              </Text>
              <Text fontSize="md" fontWeight="bold">
                ₹ {totalAmount}
              </Text>
            </HStack>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default SingleOrderDetails;
