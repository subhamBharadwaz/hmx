import React, { useEffect, useState, useRef } from "react";
import { IOrder } from "../../../types/order";
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  HStack,
  Divider,
  Badge,
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";
import NextImage from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { adminUpdateSingleOrder } from "../../../store/services/admin/adminOrderSlice";
interface IOrderData {
  order: IOrder;
}

const UpdateOrder = ({ order }: IOrderData) => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const [apiError, setApiError] = useState<string | null>(null);

  const { shippingInfo, shippingAmount, orderStatus, totalAmount, taxAmount } =
    order;
  const [status, setStatus] = useState(orderStatus as string);

  const handleOrderStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (status === "Delivered") {
      toast({
        position: "top-right",
        title: "Order is already marked for delivered",
        description: "Can't change the order status after being delivered.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    } else {
      setStatus(e.target.value);
      // ? This fixes the bug of getting previous value on change input... so pass e.target.value also in the dispatch
      dispatch(
        adminUpdateSingleOrder({ id: order._id, orderStatus: e.target.value })
      )
        .unwrap()
        .then(() => {
          toast({
            id: "order-update-toast",
            title: "Order updated successfully.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        })
        .catch((error: { message: string }) => {
          setApiError(error.message);
        });
    }
  };

  return (
    <Box my={10}>
      <Box>
        <Text
          display="inline-block"
          color="blackAlpha.600"
          fontWeight="bold"
          fontSize="sm"
        >
          ORDER# <span className="text-bold">{order?._id}</span>
        </Text>
        <Text
          display="inline-block"
          color="blackAlpha.600"
          fontWeight="bold"
          fontSize="sm"
          ml={5}
        >
          ORDER PLACED{" "}
          <span className="text-bold">
            {" "}
            {new Date(order?.createdAt).toLocaleDateString()}
          </span>
        </Text>
      </Box>
      <Flex
        justifyContent="space-between"
        direction={["column", "column", "row"]}
        alignItems="flex-start"
      >
        <Box minW={["100%", "100%", "60%"]}>
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
                      fontSize="sm"
                      colorScheme={
                        status === "Delivered"
                          ? "green"
                          : status === "Processing"
                          ? "yellow"
                          : "cyan"
                      }
                    >
                      {status}
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

                    <VStack>
                      <Text fontSize="md" fontWeight="bold">
                        Change Order Status
                      </Text>
                      <Select value={status} onChange={handleOrderStatusChange}>
                        <option value="" disabled={true}>
                          Select an option
                        </option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">
                          Out for delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                      </Select>
                    </VStack>
                  </Stack>
                </Flex>
              </Box>
            ))}
          </Box>
        </Box>
        <Box minW={["100%", "100%", "35%"]}>
          <Box
            mx="auto"
            border="1px"
            borderColor="gray.300"
            my={4}
            p={5}
            pos="relative"
          >
            <Stack spacing={3}>
              <Text fontSize="sm" fontWeight="bold" color="blackAlpha.500">
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
              <Text fontSize="sm" fontWeight="bold" color="blackAlpha.500">
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
    </Box>
  );
};

export default UpdateOrder;
