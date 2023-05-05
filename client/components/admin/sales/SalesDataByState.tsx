import React, { useEffect, useState } from "react";
import { PieChart, Pie, Legend, Tooltip, Cell } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import {
  adminGetSalesData,
  adminGetSalesDataByStates,
} from "../../../store/services/admin/adminSalesSlice";
import { AppDispatch, RootState } from "../../../store";
import { Text, HStack, Select, Flex, Stack, Box } from "@chakra-ui/react";
import { Toast } from "../../Toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SalesDataBySate = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date());

  const { loading, salesDataByState, error } = useSelector(
    (state: RootState) => state.adminSalesSlice
  );

  const handleDateChange = (date) => {
    setStartDate(date);

    dispatch(
      adminGetSalesDataByStates({
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
  const { addToast } = Toast();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (error) {
      addToast({
        id: "sales-state-toast",
        title: "Unable to fetch sales details.",
        description: error,
        status: "error",
      });
    }
  }, [error, addToast]);

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
      {!loading && salesDataByState?.length > 0 ? (
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
      ) : (
        <Text fontSize="lg">
          There is no data to show at during this month/year. Please change the
          date.
        </Text>
      )}
    </Stack>
  );
};

export default SalesDataBySate;
