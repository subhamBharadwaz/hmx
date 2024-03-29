/* eslint-disable react/no-children-prop */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import NextImage from "next/image";
import NextLink from "next/link";
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
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

import { AppDispatch, RootState } from "../../store";
import { loginUserSchema } from "../../schema/userSchema";
import { CreateLoginUserInput } from "../../types/user";
import { loginUser, userDetails } from "../../store/services/auth/auth-slice";
import withAuth from "../../components/HOC/withAuth";
import { Toast } from "../../components/Toast";

function LoginPage() {
  const { isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { addToast } = Toast();

  useEffect(() => {
    if (error) {
      addToast({
        id: "error-toast",
        title: "Unable to login.",
        description: error,
        status: "error",
      });
    }
  }, [error, addToast]);

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateLoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  async function onSubmit(values: CreateLoginUserInput) {
    dispatch(loginUser(values))
      .unwrap()
      .then(() => {})
      .catch((error: { message: string }) => {
        setApiError(error.message);
      });
  }

  const handleShowPassword = () => setShowPassword(!showPassword);

  // Redirect if logged in
  if (isAuthenticated) router.push("/");

  return (
    <Box>
      <Flex
        justifyContent="space-around"
        flexDirection={["column", "column", "row"]}
        alignItems="center"
      >
        <Box
          position="relative"
          w={[300, 400, 500]}
          h={[300, 400, 600]}
          mb={[10, 10, 0]}
          mr={[0, 0, "2em"]}
        >
          <NextImage
            src="/static/images/banner.webp"
            layout="fill"
            objectFit="cover"
            alt="Banner"
          />
        </Box>
        <Box
          w={["full", "full", "2xl"]}
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
                  placeholder="Email"
                  {...register("email")}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={7} isInvalid={Boolean(errors.password)}>
                <InputGroup>
                  <Input
                    pr="4.5rem"
                    rounded={5}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    {...register("password")}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
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
            <Flex justifyContent="center" alignItems="center" w="100%">
              {loading && <Spinner />}
            </Flex>
          </VStack>
          <Text mt={7}>
            Not a Registered Customer?{" "}
            <Button variant="link">
              <NextLink href="/auth/register">Register</NextLink>
            </Button>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

export default LoginPage;
