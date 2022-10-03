import React from "react";

import { useSelector } from "react-redux";
import { RootState, wrapper } from "../../../store";

import UpdateUserDetails from "../../../components/user/admin/UpdateUserDetails";
import { getSingleUser } from "../../../store/services/admin/adminUserSlice";
import { getCookie } from "cookies-next";

import { Spinner, Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

export default function SingleUserDetails() {
  const { loading, user } = useSelector(
    (state: RootState) => state.adminUserActions
  );

  return (
    <Box>
      {loading ? (
        <Box mx="auto" w="65%" padding="6" boxShadow="sm" bg="white">
          <SkeletonCircle size="20" />
          <SkeletonText mt="8" noOfLines={4} spacing="6" />
        </Box>
      ) : (
        user && <UpdateUserDetails user={user.user} />
      )}
    </Box>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, params }) => {
      const token = getCookie("token", { req, res });
      const { id } = params;
      await store.dispatch(getSingleUser({ token, id }));
      return {
        props: {},
      };
    }
);
