/* eslint-disable react/no-children-prop */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { registerUser } from "../../store/auth/auth-slice";
import {
  Box,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  Button,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  VStack,
  HStack,
  Heading,
  Text,
  Spinner,
} from "@chakra-ui/react";

import { registerUserSchema } from "../../schema/userSchema";
import { CreateRegisterUserInput } from "../../types/user";
import { AppDispatch, RootState } from "../../store";

export default function RegisterPage() {
  const [registerError, setRegisterError] = useState(null);

  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateRegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
  });

  async function onSubmit(values: CreateRegisterUserInput) {
    const formData = { ...values, photo: values.photo[0] };
    dispatch(registerUser(formData));
    console.log("submitted");
  }

  // Redirect if logged in
  if (isAuthenticated) router.push("/auth");

  return (
    <Box p="2em">
      <Flex
        justifyContent="space-around"
        flexDirection={["column", "column", "row"]}
        alignItems={["center"]}
      >
        <Box
          position="relative"
          w={[300, 400, 500]}
          h={[300, 400, 600]}
          mb={[10, 10, 0]}
          mr={[0, 0, "2em"]}
        >
          <Image
            src="/static/images/banner.webp"
            layout="fill"
            objectFit="cover"
            alt="Banner"
          />
        </Box>
        <Box
          w={["md", "xl"]}
          p={[8, 10]}
          border={["none", "1px"]}
          borderColor={["", "gray.300"]}
          borderRadius={10}
        >
          <VStack spacing={4} align="flex-start" w="full">
            <VStack spacing={1} align={["flex-start", "center"]} w="full">
              <Heading>Sign Up</Heading>
              <Text>
                Hi new buddy, let&apos;s get you started with the HMX!
              </Text>
            </VStack>

            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={Boolean(errors.firstName)}>
                <Input
                  id="firstName"
                  rounded={5}
                  variant="filled"
                  placeholder="First Name *"
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
                  variant="filled"
                  {...register("lastName")}
                />
                <FormErrorMessage>
                  {errors.lastName && errors.lastName.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={7} isInvalid={Boolean(errors.email)}>
                <Input
                  id="email"
                  type="email"
                  rounded={5}
                  placeholder="Email *"
                  variant="filled"
                  {...register("email")}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={7} isInvalid={Boolean(errors.password)}>
                <Input
                  id="password"
                  type="password"
                  rounded={5}
                  placeholder="Password *"
                  variant="filled"
                  {...register("password")}
                />
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={7} isInvalid={Boolean(errors.confirmPassword)}>
                <Input
                  id="password"
                  type="password"
                  rounded={5}
                  placeholder="Confirm Password *"
                  variant="filled"
                  {...register("confirmPassword")}
                />
                <FormErrorMessage>
                  {errors.confirmPassword && errors.confirmPassword.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={7} isInvalid={Boolean(errors.phoneNumber)}>
                <InputGroup>
                  <InputLeftAddon children="+91" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    rounded={5}
                    placeholder="Phone Number *"
                    variant="filled"
                    {...register("phoneNumber")}
                  />
                </InputGroup>
                <FormHelperText>
                  We&apos;ll send order status update to your mobile number.
                </FormHelperText>

                <FormErrorMessage>
                  {errors.phoneNumber && errors.phoneNumber.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={7}>
                <HStack>
                  <FormLabel htmlFor="photo"> Profile Picture *</FormLabel>

                  <Input
                    variant="filled"
                    colorScheme="linkedin"
                    name="photo"
                    type="file"
                    {...register("photo")}
                    w="auto"
                  />

                  {loading && <Spinner />}
                </HStack>
              </FormControl>

              <Button
                rounded={5}
                colorScheme="blue"
                w="full"
                mt={7}
                type="submit"
              >
                Register
              </Button>
            </form>
          </VStack>
          <Text mt={7}>
            Already a Customer? <Button variant="link">Login</Button>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
