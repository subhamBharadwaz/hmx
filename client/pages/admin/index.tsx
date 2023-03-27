import SalesDataChart from "../../components/admin/sales/SalesDataChart";
import SalesDataBySate from "../../components/admin/sales/SalesDataByState";
import withAuth from "../../components/HOC/withAuth";
import AdminLayout from "../../layout/AdminLayout";

const AdminDashboard = () => {
  return (
    <>
      <SalesDataChart />
      <SalesDataBySate />
    </>
  );
};

export default withAuth(AdminDashboard);
