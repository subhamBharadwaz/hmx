/* eslint-disable react/no-children-prop */
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";

import NextLink from "next/link";
import { updateUserDetails } from "../../../store/services/auth/auth-slice";
import {
  Box,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  Button,
  FormLabel,
  FormErrorMessage,
  VStack,
  HStack,
  Heading,
  Text,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";

import { updateUserSchema } from "../../../schema/userSchema";
import { CreateUpdateUserInput } from "../../../types/user";
import { AppDispatch, RootState } from "../../../store";
import { BsChevronLeft } from "react-icons/bs";
import ChangePassword from "../../../components/MyAccount/Profile/ChangePassword";
import ImageUpload from "../../../components/ImageUpload";
import withAuth from "../../../components/HOC/withAuth";

function Profile() {
  const { loading, user } = useSelector((state: RootState) => state.auth);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<CreateUpdateUserInput>({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      phoneNumber: user?.phoneNumber,
    },
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    reset({
      firstName: user?.firstName,
      lastName: user?.lastName,
      phoneNumber: user?.phoneNumber,
    });
  }, [reset, user?.firstName, user?.lastName, user?.phoneNumber]);

  function onSubmit(values: CreateUpdateUserInput) {
    const data = new FormData();

    data.append("firstName", values.firstName);
    data.append("lastName", values.lastName);
    data.append("phoneNumber", values.phoneNumber);
    data.append("photo", values.photo[0]);

    dispatch(updateUserDetails(data as CreateUpdateUserInput));
  }

  return (
    <>
      <Breadcrumb
        fontWeight="medium"
        fontSize="md"
        mb={10}
        color="blackAlpha.600"
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={NextLink} href="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={NextLink} href="/my-account">
            My Account
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>My Profile</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box w={["md", "xl"]} p={[8, 10]}>
        <NextLink href="/my-account">
          <Button
            mb={10}
            color="blue.400"
            variant="link"
            size="lg"
            leftIcon={<BsChevronLeft />}
          >
            Back to My Account
          </Button>
        </NextLink>
        <Box>
          <Stack spacing={4} align="flex-start" w="full">
            <Heading size="xl">My Profile</Heading>

            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={Boolean(errors.firstName)}>
                <FormLabel
                  fontWeight="semibold"
                  color="blackAlpha.600"
                  fontSize="sm"
                >
                  First Name
                </FormLabel>
                <Input
                  id="firstName"
                  rounded={5}
                  placeholder="First Name *"
                  {...register("firstName")}
                />
                <FormErrorMessage>
                  {errors.firstName && errors.firstName.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={7} isInvalid={Boolean(errors.lastName)}>
                <FormLabel
                  fontWeight="semibold"
                  color="blackAlpha.600"
                  fontSize="sm"
                >
                  Last Name
                </FormLabel>
                <Input
                  id="lastName"
                  placeholder="Last Name *"
                  rounded={5}
                  {...register("lastName")}
                />
                <FormErrorMessage>
                  {errors.lastName && errors.lastName.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={7}>
                <FormLabel
                  fontWeight="semibold"
                  color="blackAlpha.600"
                  fontSize="sm"
                >
                  Email
                </FormLabel>
                <Input
                  pointerEvents="none"
                  id="email"
                  type="email"
                  color="blackAlpha.600"
                  rounded={5}
                  placeholder={user?.email}
                />
              </FormControl>

              <FormControl mt={7}>
                <FormLabel
                  fontWeight="semibold"
                  color="blackAlpha.600"
                  fontSize="sm"
                >
                  Password
                </FormLabel>
                <Input
                  pr="4.5rem"
                  pointerEvents="none"
                  color="blackAlpha.600"
                  rounded={5}
                  type="text"
                  placeholder="*******"
                />
              </FormControl>
              <Button
                mt={2}
                variant="unstyled"
                color="blue.500"
                size="sm"
                onClick={onOpen}
              >
                Change Password
              </Button>

              {/* Change password Model */}

              <ChangePassword onClose={onClose} isOpen={isOpen} />
              <FormControl mt={7} isInvalid={Boolean(errors.phoneNumber)}>
                <FormLabel
                  fontWeight="semibold"
                  color="blackAlpha.600"
                  fontSize="sm"
                >
                  Phone Number
                </FormLabel>
                <InputGroup>
                  <InputLeftAddon children="+91" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    rounded={5}
                    placeholder="Phone Number *"
                    {...register("phoneNumber")}
                  />
                </InputGroup>

                <FormErrorMessage>
                  {errors.phoneNumber && errors.phoneNumber.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={7}>
                <FormLabel
                  fontWeight="semibold"
                  color="blackAlpha.600"
                  fontSize="sm"
                >
                  Profile Photo
                </FormLabel>

                <ImageUpload
                  {...register("photo")}
                  isMultiple={false}
                  files={[]}
                  onChange={(file: File[]) => {
                    setValue("photo", file);
                  }}
                />
              </FormControl>
              <Flex justifyContent="center" alignItems="center" mt={10}>
                {loading && <Spinner size="xl" color="blue.500" />}
              </Flex>
              <Button
                rounded={5}
                size="lg"
                w="full"
                colorScheme="messenger"
                mt={7}
                type="submit"
              >
                SAVE CHANGES
              </Button>
            </form>
          </Stack>
        </Box>
      </Box>
    </>
  );
}

export default withAuth(Profile);
