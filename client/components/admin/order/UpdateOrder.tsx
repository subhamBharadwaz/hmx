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
} from "@chakra-ui/react";
import NextImage from "next/image";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../../store";
import { adminUpdateSingleOrder } from "../../../store/services/admin/adminOrderSlice";
import { Toast } from "../../Toast";
interface IOrderData {
  order: IOrder;
}

const UpdateOrder = ({ order }: IOrderData) => {
  const dispatch = useDispatch<AppDispatch>();
  const [apiError, setApiError] = useState<string | null>(null);

  const { shippingInfo, shippingAmount, orderStatus, totalAmount, taxAmount } =
    order;
  const [status, setStatus] = useState(orderStatus as string);

  const { addToast } = Toast();

  const handleOrderStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (status === "Delivered") {
      addToast({
        id: "order-toast",
        title: "Order is already marked for delivered",
        description: "Can't change the order status after being delivered.",
        status: "error",
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
          addToast({
            id: "order-update-toast",
            title: "Order updated successfully.",
            status: "success",
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
          <Stack boxShadow="sm" bg="white" rounded="lg" p={5}>
            <Text fontSize="lg" fontWeight="bold">
              Change Order Status
            </Text>
            <Select value={status} onChange={handleOrderStatusChange}>
              <option value="" disabled={true}>
                Select an option
              </option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </Select>
          </Stack>
          <Box pos="relative">
            <Box w="100%">
              {order?.orderItems?.map((item, idx) => (
                <Box
                  key={item._id}
                  boxShadow="sm"
                  bg="white"
                  rounded="lg"
                  overflow="hidden"
                  my={5}
                >
                  <Flex>
                    <Box h="240px" w="35%" position="relative">
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
                        w="max-content"
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
                    </Stack>
                  </Flex>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box minW={["100%", "100%", "35%"]}>
          <Box
            mx="auto"
            boxShadow="sm"
            bg="white"
            rounded="lg"
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
                <Badge variant="solid" colorScheme="green">
                  Home
                </Badge>
              </HStack>
              <Text
                fontSize="xs"
                fontWeight="medium"
              >{`${shippingInfo?.houseNo} ${shippingInfo?.streetName},${shippingInfo?.city} ${shippingInfo?.postalCode},${shippingInfo?.state},${shippingInfo?.country}`}</Text>
            </Stack>
          </Box>
          <Box mx="auto" boxShadow="sm" bg="white" rounded="lg" pos="relative">
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
