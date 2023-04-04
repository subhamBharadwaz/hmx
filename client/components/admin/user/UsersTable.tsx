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
  useToast,
} from "@chakra-ui/react";

import Link from "next/link";
import { BsChevronDown } from "react-icons/bs";
import { IUser } from "../../../types/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { capitalizeFirstLetter } from "../../../utils/utilFunctions";
import { deleteUser } from "../../../store/services/admin/adminUserSlice";

interface Users {
  users: IUser[];
}

const UsersTable = ({ users }: Users) => {
  const dispatch = useDispatch<AppDispatch>();
  const [apiError, setApiError] = useState<string | null>(null);

  const { error } = useSelector((state: RootState) => state.adminUserSlice);

  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({
        id: "admin-user-delete-toast",
        title: "Unable to delete user .",
        description: error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  return (
    <>
      <TableContainer>
        <Table
          variant="simple"
          size="lg"
          fontSize={[16, 16, 18]}
          fontWeight="medium"
          color="black"
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
                <Tr key={user.email}>
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
                                toast({
                                  id: "user-delete-toast",
                                  title: "User deleted successfully.",
                                  status: "success",
                                  duration: 9000,
                                  isClosable: true,
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
