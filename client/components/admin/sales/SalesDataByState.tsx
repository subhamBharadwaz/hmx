import React, { useEffect, useState } from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import {
  adminGetSalesData,
  adminGetSalesDataByStates,
} from "../../../store/services/admin/adminSalesSlice";
import { AppDispatch, RootState } from "../../../store";
import { Text, HStack, Select, Flex, Stack, useToast } from "@chakra-ui/react";

const SalesDataBySate = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const { loading, salesDataByState, error } = useSelector(
    (state: RootState) => state.adminSalesSlice
  );

  const toast = useToast();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (error) {
      toast({
        id: "sales-state-toast",
        title: "Unable to fetch sales details.",
        description: error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  useEffect(() => {
    dispatch(adminGetSalesDataByStates({}))
      .unwrap()
      .then(() => {})
      .catch((error: { message: string }) => {
        setApiError(error.message);
      });
  }, [dispatch]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <Stack
      minW="100%"
      minH="60vh"
      border="1px"
      borderColor="blackAlpha.100"
      p={5}
      spacing={5}
      mt={20}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <Text fontWeight="semibold" fontSize="lg">
          Sales By States
        </Text>
        <Select placeholder="Select option" w="20%">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>
      </HStack>
      {!loading && (
        <PieChart width={400} height={400}>
          <Pie
            data={salesDataByState}
            dataKey="totalRevenue"
            nameKey="_id"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {salesDataByState?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </Stack>
  );
};

export default SalesDataBySate;
