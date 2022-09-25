/* eslint-disable react/no-children-prop */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  Box,
  Flex,
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  VStack,
  Heading,
  Text,
  Spinner,
} from "@chakra-ui/react";

import { AppDispatch, RootState } from "../../store";
import { loginUserSchema } from "../../schema/userSchema";
import { CreateLoginUserInput } from "../../types/user";
import { loginUser } from "../../store/auth/auth-slice";

const passwordRegex =
  /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

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
  } = useForm<CreateLoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  async function onSubmit(values: CreateLoginUserInput) {
    dispatch(loginUser(values));
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
              <Heading>Sign In</Heading>
              <Text>Hi there!, welcome back!</Text>
            </VStack>

            <form onSubmit={handleSubmit(onSubmit)}>
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

              <Button
                rounded={5}
                colorScheme="blue"
                w="full"
                mt={7}
                type="submit"
              >
                Login
              </Button>
            </form>
            {loading && <Spinner />}
          </VStack>
          <Text mt={7}>
            Not a Registered Customer? <Button variant="link">Register</Button>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
