import React from "react";
import {
  Flex,
  Box,
  Text,
  Stack,
  HStack,
  Button,
  Badge,
} from "@chakra-ui/react";
import NextImage from "next/image";
import NextLink from "next/link";
import { IOrder } from "../../../../types/order";

interface IItem {
  _id?: string;
  name: string;
  size: string;
  quantity: number;
  image: string;
  price: number;
  product: string;
}

interface Item {
  id: string;
  orderItems: IItem[];
  order: IOrder;
}

const OrderCard = ({ orderItems, id, order }: Item) => {
  return (
    <Box mx="auto" border="1px" borderColor="gray.300" my={4} pos="relative">
      {orderItems?.map((item, idx) => (
        <Box
          key={item._id}
          className={idx !== orderItems.length - 1 ? "cardMb" : ""}
        >
          <Flex h="285px">
            <Box h="285px" w="25%" position="relative">
              <NextImage
                src={item.image}
                alt={item.name}
                layout="fill"
                objectFit="cover"
              />
            </Box>

            <Flex py={5} justifyContent="space-between" w="100%" px={5}>
              <Box ml={5}>
                <Text fontSize="xl" fontWeight="medium">
                  {item.name}
                </Text>
                <Text mt={3} fontSize="lg" fontWeight="medium">
                  Size: {item.size}
                </Text>
                <Text my={6}>
                  {new Date(order?.createdAt).toLocaleDateString()}
                </Text>

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
              </Box>
            </Flex>
          </Flex>
        </Box>
      ))}

      <NextLink href={`/my-account/orders/${id}`}>
        <Button
          fontSize={16}
          pos="absolute"
          top="auto"
          mt={13}
          bottom={10}
          right={20}
          size="lg"
          colorScheme="messenger"
          variant="outline"
          alignSelf="end"
          mr={10}
        >
          ORDER INFO
        </Button>
      </NextLink>
    </Box>
  );
};

export default OrderCard;
