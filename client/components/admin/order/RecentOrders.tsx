import { FC } from "react";
import { IOrder } from "../../../types/order";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
} from "@chakra-ui/react";

interface RecentOrdersProps {
  orders: IOrder[];
}

const RecentOrders: FC<RecentOrdersProps> = ({ orders }) => {
  console.log(orders);
  return (
    <Box bg="white" boxShadow="sm" rounded="lg" p={5} h="md" w="full">
      <Text fontWeight="semibold" fontSize="lg">
        Recent Orders
      </Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>#Order No</Th>
              <Th>Date</Th>
              <Th> Customer Name</Th>
              <Th> Price</Th>
              <Th> Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders?.map((order) => (
              <Tr
                key={order?._id}
                color="blackAlpha.900"
                fontSize="sm"
                transition="background-color 0.3s ease-in-out,color 0.3s ease-in-out"
                _hover={{ background: "gray.100", color: "blackAlpha.900" }}
              >
                <Td>
                  <Text>{order?._id}</Text>
                </Td>
                <Td>
                  <Text>{new Date(order?.createdAt).toLocaleDateString()}</Text>
                </Td>
                <Td>
                  <Text>{`${order?.shippingInfo?.firstName} ${order?.shippingInfo?.lastName}`}</Text>
                </Td>
                <Td>
                  <Text>{`₹${order?.totalAmount}`}</Text>
                </Td>
                <Td>
                  {" "}
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
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RecentOrders;
