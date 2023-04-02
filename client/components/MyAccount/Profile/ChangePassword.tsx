import React, { useEffect, useState } from "react";
import {
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
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
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch, RootState } from "../../../store";
import { CreateChangePasswordInput } from "../../../types/user";
import { changePasswordSchema } from "../../../schema/userSchema";
import { updateUserPassword } from "../../../store/services/auth/auth-slice";

const ChangePassword = ({ onClose, isOpen }) => {
  const [apiError, setApiError] = useState<string | null>(null);
  const { loading, user, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({
        id: "error-toast",
        title: "Unable to update password.",
        description: error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CreateChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleShowPassword = () => setShowPassword(!showPassword);

  async function onSubmit(values: CreateChangePasswordInput) {
    dispatch(updateUserPassword(values))
      .unwrap()
      .then(() => {
        toast({
          id: "success-toast",
          title: "Password updated successfully.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error: { message: string }) => {
        setApiError(error.message);
      });
    if (!loading && !Object.keys(errors).length) {
      onClose();
    }
    reset();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Change Password{" "}
          <Text fontSize="sm" color="blackAlpha.600">
            {user?.email}
          </Text>
        </ModalHeader>

        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5}>
              <FormControl isInvalid={Boolean(errors.currentPassword)}>
                <FormLabel
                  fontWeight="semibold"
                  color="blackAlpha.600"
                  fontSize="sm"
                >
                  Enter Your Current Password
                </FormLabel>
                <InputGroup>
                  <Input
                    id="currentPassword"
                    rounded={5}
                    type={showPassword ? "text" : "password"}
                    placeholder="Current Password*"
                    {...register("currentPassword")}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.currentPassword && errors.currentPassword.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.newPassword)}>
                <FormLabel
                  fontWeight="semibold"
                  color="blackAlpha.600"
                  fontSize="sm"
                >
                  Enter Your New Password
                </FormLabel>
                <InputGroup>
                  <Input
                    id="newPassword"
                    rounded={5}
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password*"
                    {...register("newPassword")}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.newPassword && errors.newPassword.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.confirmNewPassword)}>
                <FormLabel
                  fontWeight="semibold"
                  color="blackAlpha.600"
                  fontSize="sm"
                >
                  Confirm New Password
                </FormLabel>
                <InputGroup>
                  <Input
                    id="confirmNewPassword"
                    rounded={5}
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm New Password*"
                    {...register("confirmNewPassword")}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage>
                  {errors.confirmNewPassword &&
                    errors.confirmNewPassword.message}
                </FormErrorMessage>
              </FormControl>
            </Stack>
            <Button w="full" type="submit" mt={10} colorScheme="messenger">
              UPDATE PASSWORD
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangePassword;
