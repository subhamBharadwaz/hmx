/* eslint-disable react/no-children-prop */
import React, { FormEvent, useState, useRef } from "react";
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
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
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
import { AppDispatch } from "../../../store";
import { updateUserDetails } from "../../../store/services/admin/adminUserSlice";
import { AiOutlineCloudUpload } from "react-icons/ai";

interface User {
  user: IUser;
}

const UpdateUserDetails = ({ user }: User) => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateAdminUpdateUserInput>({
    resolver: zodResolver(adminUpdateUserSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
  });

  function submitHandler(values: UpdateUser) {
    // TODO
    // const formData = { ...values, photo: values.photo[0] };
    dispatch(updateUserDetails({ values, id: user._id }));
    toast({
      title: "User edited successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  }

  return (
    <>
      {user && (
        <Box
          w="80%"
          maxH="100%"
          boxShadow="0 4px 12px rgba(0,0,0,0.05)"
          mx="auto"
          position="relative"
        >
          <Flex p="2rem">
            <Box w="35%">
              <WrapItem>
                <VStack>
                  <Avatar
                    size="2xl"
                    name={user.firstName}
                    src={user.photo.secure_url}
                  />

                  <Text fontSize={18} as="b">{`${capitalizeFirstLetter(
                    user.firstName
                  )} ${capitalizeFirstLetter(user.lastName)}`}</Text>
                </VStack>
              </WrapItem>
            </Box>

            <Box w="65%">
              <form onSubmit={handleSubmit(submitHandler)}>
                <Stack spacing={5}>
                  <Text as="b" fontSize={18}>
                    Personal Information
                  </Text>

                  <HStack>
                    <FormControl isInvalid={Boolean(errors.firstName)}>
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
                  <Text as="b" fontSize={18}>
                    Email Address
                  </Text>

                  <FormControl mt={7} isInvalid={Boolean(errors.email)}>
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
                  <Text as="b" fontSize={18}>
                    Mobile Number
                  </Text>

                  <FormControl mt={7} isInvalid={Boolean(errors.phoneNumber)}>
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
                  <Text as="b" fontSize={18}>
                    Account Role
                  </Text>

                  <FormControl mt={7} isInvalid={Boolean(errors.role)}>
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

                <Button colorScheme="telegram" type="submit" mt={7}>
                  SAVE CHANGES
                </Button>
              </form>
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default UpdateUserDetails;
