import React from "react";
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
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { capitalizeFirstLetter } from "../../../utils/utilFunctions";
import { deleteUser } from "../../../store/services/admin/adminUserSlice";

interface Users {
  users: IUser[];
}

const UsersTable = ({ users }: Users) => {
  const dispatch = useDispatch<AppDispatch>();

  const toast = useToast();

  return (
    <>
      <TableContainer>
        <Table
          variant="simple"
          size="lg"
          fontSize={18}
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
                            dispatch(deleteUser(user._id));
                            toast({
                              title: "User deleted successfully",
                              status: "success",
                              duration: 3000,
                              isClosable: true,
                              position: "top-right",
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
