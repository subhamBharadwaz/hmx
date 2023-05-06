/* eslint-disable react/no-children-prop */
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  VStack,
  WrapItem,
  Text,
  HStack,
  Stack,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftAddon,
  Button,
  Select,
  IconButton,
  FormLabel,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCloudUpload } from "react-icons/ai";

import {
  CreateAdminUpdateUserInput,
  IUser,
  ROLE,
  UpdateUser,
} from "../../../types/user";
import { capitalizeFirstLetter } from "../../../utils/utilFunctions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { adminUpdateUserSchema } from "../../../schema/adminSchema";
import { AppDispatch, RootState } from "../../../store";
import { updateUserDetails } from "../../../store/services/admin/adminUserSlice";
import { Toast } from "../../Toast";

interface User {
  user: IUser;
}

const UpdateUserDetails = ({ user }: User) => {
  const dispatch = useDispatch<AppDispatch>();
  const [apiError, setApiError] = useState<string | null>(null);

  const { loading, error } = useSelector(
    (state: RootState) => state.adminUserSlice
  );

  // Toast
  const { addToast } = Toast();

  useEffect(() => {
    if (error) {
      addToast({
        id: "admin-user-update-toast",
        title: "Unable to update user details.",
        description: error,
        status: "error",
      });
    }
  }, [error, addToast]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateAdminUpdateUserInput>({
    resolver: zodResolver(adminUpdateUserSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      role: user?.role,
    },
  });

  function submitHandler(values: UpdateUser) {
    dispatch(updateUserDetails({ values, id: user?._id }))
      .unwrap()
      .then(() => {
        addToast({
          id: "user-update-toast",
          title: "User updated successfully.",
          status: "success",
        });
      })
      .catch((error: { message: string }) => {
        setApiError(error.message);
      });
  }

  return (
    <>
      {user && (
        <Box
          w="100%"
          boxShadow="sm"
          bg="white"
          rounded="lg"
          mx="auto"
          position="relative"
          my={10}
        >
          <Stack p="1em">
            <Box w="100%" mx="auto">
              <VStack>
                <Avatar
                  size="2xl"
                  name={user?.firstName}
                  src={user?.photo?.secure_url}
                />

                <Text fontSize={18} as="b">{`${capitalizeFirstLetter(
                  user?.firstName
                )} ${capitalizeFirstLetter(user?.lastName)}`}</Text>
              </VStack>
            </Box>

            <Box w="100%" mt={6}>
              <form onSubmit={handleSubmit(submitHandler)}>
                <Stack spacing={5}>
                  <Text fontSize={[16, 16, 18]} as="b">
                    Personal Information
                  </Text>
                  <HStack>
                    <FormControl isInvalid={Boolean(errors.firstName)}>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        id="firstName"
                        rounded={5}
                        placeholder="First Name *"
                        fontWeight="semibold"
                        {...register("firstName")}
                      />
                      <FormErrorMessage>
                        {errors.firstName && errors.firstName.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl mt={7} isInvalid={Boolean(errors.lastName)}>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        id="lastName"
                        placeholder="Last Name *"
                        rounded={5}
                        fontWeight="semibold"
                        {...register("lastName")}
                      />
                      <FormErrorMessage>
                        {errors.lastName && errors.lastName.message}
                      </FormErrorMessage>
                    </FormControl>
                  </HStack>
                </Stack>

                <Stack spacing={5} mt={10}>
                  <FormControl mt={7} isInvalid={Boolean(errors.email)}>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      fontWeight="semibold"
                      rounded={5}
                      placeholder="Email *"
                      {...register("email")}
                    />
                    <FormErrorMessage>
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>

                <Stack spacing={5} mt={10}>
                  <FormControl mt={7} isInvalid={Boolean(errors.phoneNumber)}>
                    <FormLabel>Mobile Number</FormLabel>
                    <InputGroup>
                      <InputLeftAddon children="+91" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        fontWeight="semibold"
                        rounded={5}
                        placeholder="Phone Number *"
                        {...register("phoneNumber")}
                      />
                    </InputGroup>

                    <FormErrorMessage>
                      {errors.phoneNumber && errors.phoneNumber.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
                <Stack spacing={5} mt={10}>
                  <FormControl mt={7} isInvalid={Boolean(errors.role)}>
                    <FormLabel>Account Role</FormLabel>
                    <Select
                      placeholder="Select User Role"
                      fontWeight="semibold"
                      {...register("role")}
                    >
                      <option value={ROLE.ADMIN}>Admin</option>
                      <option value={ROLE.USER}>User</option>
                    </Select>
                    <FormErrorMessage>
                      {errors.role && errors.role.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>

                <Button colorScheme="messenger" type="submit" mt={7}>
                  SAVE CHANGES
                </Button>
              </form>
            </Box>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default UpdateUserDetails;
