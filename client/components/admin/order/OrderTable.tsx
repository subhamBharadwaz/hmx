import React from "react";
import {
  TableContainer,
  Table,
  Text,
  TableCaption,
  Thead,
  Th,
  Tr,
  Td,
  Tbody,
  Button,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";

import NextLink from "next/link";
import { BsChevronDown } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { IOrder } from "../../../types/order";
import { adminDeleteSingleOrder } from "../../../store/services/admin/adminOrderSlice";

interface IOrdersData {
  orders: IOrder[];
}

const OrdersTable = ({ orders }: IOrdersData) => {
  const dispatch = useDispatch<AppDispatch>();

  const toast = useToast();

  return (
    <>
      <TableContainer>
        <Table
          variant="simple"
          size="lg"
          fontSize={18}
          fontWeight="medium"
          color="black"
        >
          <TableCaption>All Areas</TableCaption>
          <Thead>
            <Tr>
              <Th>ORDER ID.</Th>
              <Th>CREATED</Th>
              <Th>CUSTOMER</Th>
              <Th>PRODUCTS</Th>
              <Th>DESTINATION</Th>
              <Th>STATUS</Th>
              <Th>PRICE</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders &&
              orders?.map((order) => (
                <Tr
                  key={order?._id}
                  color="blackAlpha.700"
                  fontSize="medium"
                  transition="background-color 0.3s ease-in-out,color 0.3s ease-in-out"
                  _hover={{ background: "gray.100", color: "blackAlpha.900" }}
                >
                  <Td>{order?._id}</Td>
                  <Td>{new Date(order?.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <Text>{`${order?.shippingInfo?.firstName} ${order?.shippingInfo?.lastName}`}</Text>
                  </Td>
                  <Td>
                    <Text
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      maxW={200}
                    >
                      {order?.orderItems?.map((item) => item?.name).join(", ")}
                    </Text>
                  </Td>
                  <Td>
                    <Text>{`${order?.shippingInfo?.streetName}, ${order?.shippingInfo?.city}`}</Text>
                  </Td>
                  <Td>
                    <Badge
                      fontSize="sm"
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
                  </Td>

                  <Td>
                    <Text fontWeight="semibold">₹ {order?.totalAmount}</Text>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
                        Actions
                      </MenuButton>
                      <MenuList>
                        <NextLink
                          href="/admin/orders/[id]"
                          as={`/admin/orders/${order._id}`}
                        >
                          <MenuItem>Edit</MenuItem>
                        </NextLink>
                        <MenuItem
                          onClick={() => {
                            dispatch(adminDeleteSingleOrder(order?._id))
                              .unwrap()
                              .then(() => {
                                toast({
                                  id: "order-delete-toast",
                                  title: "Order deleted successfully.",
                                  status: "success",
                                  duration: 9000,
                                  isClosable: true,
                                });
                              })
                              .catch((error: { message: string }) => {
                                console.error(error.message);
                              });
                          }}
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    {/* Here the alert footer button giving the last item only */}
                    {/* <AlertDialog
                      isOpen={isOpen}
                      leastDestructiveRef={cancelRef}
                      onClose={onClose}
                    >
                      <AlertDialogOverlay>
                        <AlertDialogContent>
                          <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Order
                          </AlertDialogHeader>

                          <AlertDialogBody>
                            Are you sure? You can&apos;t undo this action
                            afterwards.
                          </AlertDialogBody>

                          <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                              Cancel
                            </Button>

                            <Button
                              ml={3}
                              onClick={() =>
                                handleOrderDelete(order?.orderStatus)
                              }
                              colorScheme="red"
                            >
                              Delete
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialogOverlay>
                    </AlertDialog> */}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrdersTable;
