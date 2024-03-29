import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  Text,
  TableCaption,
  Thead,
  Th,
  Tr,
  Td,
  Tbody,
  Button,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import { BsChevronDown } from "react-icons/bs";
import Link from "next/link";

import { IUser } from "../../../types/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { capitalizeFirstLetter } from "../../../utils/utilFunctions";
import { deleteUser } from "../../../store/services/admin/adminUserSlice";
import { Toast } from "../../Toast";

interface Users {
  users: IUser[];
}

const UsersTable = ({ users }: Users) => {
  const dispatch = useDispatch<AppDispatch>();
  const [apiError, setApiError] = useState<string | null>(null);

  const { error } = useSelector((state: RootState) => state.adminUserSlice);

  const { addToast } = Toast();

  useEffect(() => {
    if (error) {
      addToast({
        id: "admin-user-delete-toast",
        title: "Unable to delete user .",
        description: error,
        status: "error",
      });
    }
  }, [error, addToast]);

  return (
    <>
      <TableContainer boxShadow="sm" bg="white" rounded="lg">
        <Table
          variant="simple"
          size="lg"
          fontWeight="medium"
          color="blackAlpha.800"
        >
          <TableCaption>All Areas</TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Role</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users &&
              users.map((user) => (
                <Tr
                  key={user.email}
                  fontSize="medium"
                  transition="background-color 0.3s ease-in-out,color 0.3s ease-in-out"
                  _hover={{ background: "gray.100", color: "blackAlpha.900" }}
                >
                  <Td>
                    <HStack>
                      <Avatar
                        size="sm"
                        name={user.firstName}
                        src={user.photo.secure_url}
                      />
                      <Text>{`${user.firstName} ${user.lastName}`}</Text>
                    </HStack>
                  </Td>
                  <Td>{user.email}</Td>
                  <Td>{user?.phoneNumber}</Td>
                  <Td>
                    {user.role === "admin" ? (
                      <Text color="red.400" fontWeight="bold">
                        {capitalizeFirstLetter(user.role)}
                      </Text>
                    ) : (
                      capitalizeFirstLetter(user.role)
                    )}
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
                        Actions
                      </MenuButton>
                      <MenuList>
                        <Link
                          href="/admin/users/[id]"
                          as={`/admin/users/${user._id}`}
                        >
                          <MenuItem>Edit</MenuItem>
                        </Link>
                        <MenuItem
                          onClick={() => {
                            dispatch(deleteUser(user._id))
                              .unwrap()
                              .then(() => {
                                addToast({
                                  id: "user-delete-toast",
                                  title: "User deleted successfully.",
                                  status: "success",
                                });
                              })
                              .catch((error: { message: string }) => {
                                setApiError(error.message);
                              });
                          }}
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UsersTable;
