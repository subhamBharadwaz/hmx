import { useEffect } from "react";
import SalesDataChart from "../../components/admin/sales/SalesDataChart";
import SalesDataBySate from "../../components/admin/sales/SalesDataByState";
import withAuth from "../../components/HOC/withAuth";
import AdminLayout from "../../layout/AdminLayout";
import Card from "../../components/Card";
import Wave1 from "../../public/static/svgs/wave1.svg";
import Wave2 from "../../public/static/svgs/wave2.svg";
import Wave3 from "../../public/static/svgs/wave3.svg";
import Wave4 from "../../public/static/svgs/wave4.svg";
import { Stack, Flex, Box } from "@chakra-ui/react";
import TopProducts from "../../components/admin/product/TopProducts";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { getTopSellingProducts } from "../../store/services/product/productSlice";
import RecentOrders from "../../components/admin/order/RecentOrders";
import {
  adminGetAllRecentOrders,
  adminGetTotalDeliveredOrders,
  adminGetTotalNumberOfOrders,
} from "../../store/services/admin/adminOrderSlice";
import { adminGetTotalRevenue } from "../../store/services/admin/adminSalesSlice";
import { adminGetTotalNumberOfProducts } from "../../store/services/admin/adminProductSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getTopSellingProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(adminGetTotalNumberOfProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(adminGetAllRecentOrders());
  }, [dispatch]);

  useEffect(() => {
    dispatch(adminGetTotalNumberOfOrders());
  }, [dispatch]);

  useEffect(() => {
    dispatch(adminGetTotalDeliveredOrders());
  }, [dispatch]);

  useEffect(() => {
    dispatch(adminGetTotalRevenue());
  }, [dispatch]);

  const { topSellingProducts } = useSelector(
    (state: RootState) => state.productSlice
  );
  const { total: totalProducts } = useSelector(
    (state: RootState) => state.adminProductSlice
  );

  const {
    orders,
    total: totalOrders,
    totalDeliveredOrders,
  } = useSelector((state: RootState) => state.adminOrderSlice);
  const { totalRevenue } = useSelector(
    (state: RootState) => state.adminSalesSlice
  );

  return (
    <>
      <Stack
        mb={5}
        display="flex"
        justifyContent="space-between"
        w="full"
        direction={["column", "column", "row"]}
        spacing={4}
      >
        <Card
          title="Total Revenue"
          value={`₹ ${totalRevenue ? totalRevenue : 0}`}
          imgSrc={Wave1}
        />
        <Card
          title="Total Products"
          value={totalProducts ? totalProducts : 0}
          imgSrc={Wave2}
        />
        <Card
          title="Total Orders"
          value={totalOrders ? totalOrders : 0}
          imgSrc={Wave3}
        />
        <Card
          title="Total Delivered Orders"
          value={totalDeliveredOrders ? totalDeliveredOrders : 0}
          imgSrc={Wave4}
        />
      </Stack>
      <Flex
        justifyContent="space-between"
        w="full"
        flexDirection={["column", "column", "row"]}
        mt={10}
      >
        <Box w={["100%", "100%", "65%"]}>
          <SalesDataChart />
        </Box>
        <Box w={["100%", "100%", "30%"]} mt={[10, 10, 0]}>
          <TopProducts products={topSellingProducts && topSellingProducts} />
        </Box>
      </Flex>

      <Flex
        justifyContent="space-between"
        w="full"
        alignItems="center"
        flexDirection={["column", "column", "row"]}
        mt={10}
      >
        <Box w={["100%", "100%", "40%"]}>
          <SalesDataBySate />
        </Box>
        <Box w={["100%", "100%", "55%"]} my={[10, 10, 0]}>
          <RecentOrders orders={orders && orders} />
        </Box>
      </Flex>
    </>
  );
};

export default withAuth(AdminDashboard, true);
