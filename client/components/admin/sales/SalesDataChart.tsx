import React, { useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { useDispatch, useSelector } from "react-redux";
import { adminGetSalesData } from "../../../store/services/admin/adminSalesSlice";
import { AppDispatch, RootState } from "../../../store";
import { Text, HStack, Select, Flex, Stack } from "@chakra-ui/react";

const SalesDataChart = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(adminGetSalesData({ year: "2023", month: "03" }));
  }, [dispatch]);

  const { loading, salesData } = useSelector(
    (state: RootState) => state.adminSalesSlice
  );

  return (
    <Stack
      minW="100%"
      h="60vh"
      border="1px"
      borderColor="blackAlpha.100"
      p={5}
      spacing={5}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <Text fontWeight="semibold" fontSize="lg">
          Sales
        </Text>
        <Select placeholder="Select option" w="20%">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>
      </HStack>
      {!loading && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={600}
            height={300}
            data={salesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="yearMonth" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalRevenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Stack>
  );
};

export default SalesDataChart;
