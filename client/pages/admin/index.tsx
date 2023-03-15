import { useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Sidebar from "../../components/admin/Sidebar";
import { useRouter } from "next/router";
import SalesDataChart from "../../components/admin/sales/SalesDataChart";
import SalesDataBySate from "../../components/admin/sales/SalesDataByState";
import withAuth from "../../components/HOC/withAuth";
import AdminLayout from "../../layout/AdminLayout";

const AdminDashboard = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  // useEffect(() => {
  //   if (isAuthenticated && user?.role !== "admin") {
  //     router.push("/404");
  //   }
  // }, [isAuthenticated, router, user?.role]);
  return (
    <>
      <SalesDataChart />
      <SalesDataBySate />
    </>
  );
};

export default withAuth(AdminDashboard, AdminLayout);
