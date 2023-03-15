import React, { useEffect } from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import {
  adminGetSalesData,
  adminGetSalesDataByStates,
} from "../../../store/services/admin/adminSalesSlice";
import { AppDispatch, RootState } from "../../../store";
import { Text, HStack, Select, Flex, Stack } from "@chakra-ui/react";

const SalesDataBySate = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(adminGetSalesDataByStates({}));
  }, [dispatch]);

  const { loading, salesDataByState } = useSelector(
    (state: RootState) => state.adminSalesSlice
  );

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
