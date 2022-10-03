import React, { useEffect } from "react";
import { Box, Spinner, Flex } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import UsersTable from "../../../components/user/admin/UsersTable";
import { AppDispatch, RootState, wrapper } from "../../../store";
import {
  deleteUser,
  getAllUsers,
} from "../../../store/services/admin/adminUserSlice";

export default function Users() {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, users } = useSelector(
    (state: RootState) => state.adminUserActions
  );

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  return (
    <Box>
      <Flex alignItems="center" justifyContent="center" flex={1}>
        {loading ? (
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="green.500"
          />
        ) : (
          <UsersTable users={users} />
        )}
      </Flex>
    </Box>
  );
}
