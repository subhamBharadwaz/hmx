import React, { useEffect, useState } from "react";
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
import { Text, HStack, Select, Flex, Stack, Box } from "@chakra-ui/react";
import { Toast } from "../../Toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SalesDataChart = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [apiError, setApiError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date());

  const handleDateChange = (date) => {
    setStartDate(date);

    dispatch(
      adminGetSalesData({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      })
    )
      .unwrap()
      .then(() => {})
      .catch((error: { message: string }) => {
        setApiError(error.message);
      });
  };

  const { loading, salesData, error } = useSelector(
    (state: RootState) => state.adminSalesSlice
  );

  const { addToast } = Toast();

  useEffect(() => {
    if (error) {
      addToast({
        id: "sales-state-chart-toast",
        title: "Unable to fetch sales details.",
        description: error,
        status: "error",
      });
    }
  }, [error, addToast]);

  return (
    <Stack
      minW="full"
      border="1px"
      h="md"
      borderColor="blackAlpha.100"
      p={5}
      spacing={5}
      bg="white"
      boxShadow="sm"
      rounded="lg"
    >
      <HStack justifyContent="space-between" alignItems="center">
        <Text fontWeight="semibold" fontSize="lg">
          Sales
        </Text>

        <Box
          border="1px"
          borderColor="blackAlpha.200"
          rounded="md"
          px={3}
          py={2}
        >
          <DatePicker selected={startDate} onChange={handleDateChange} />
        </Box>
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
