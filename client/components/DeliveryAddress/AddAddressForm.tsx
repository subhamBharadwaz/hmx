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
  Stack,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  HStack,
  InputLeftAddon,
} from "@chakra-ui/react";

import { AppDispatch, RootState } from "../../store";
import { loginUserSchema } from "../../schema/userSchema";
import { CreateLoginUserInput } from "../../types/user";
import { loginUser, userDetails } from "../../store/services/auth/auth-slice";

import { createAddressSchema } from "../../schema/addressSchema";
import { CreateAddressInput } from "../../types/address";
import { createShippingAddress } from "../../store/services/address/addressSlice";

const AddAddress = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { shippingAddress } = useSelector(
    (state: RootState) => state.addressSlice
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateAddressInput>({
    resolver: zodResolver(createAddressSchema),
  });

  async function onSubmit(values: CreateAddressInput) {
    dispatch(createShippingAddress(values));
    if (!Object.keys(errors).length) {
      onClose();
    }
  }

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Address</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex alignItems="center" justifyContent="space-between">
                <FormControl mt={7} isInvalid={Boolean(errors.firstName)}>
                  <Input
                    id="firstName"
                    type="text"
                    rounded={5}
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
                    type="text"
                    rounded={5}
                    placeholder="Last Name *"
                    {...register("lastName")}
                  />
                  <FormErrorMessage>
                    {errors.lastName && errors.lastName.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
              <FormControl mt={7} isInvalid={Boolean(errors.houseNo)}>
                <Input
                  id="houseNo"
                  type="text"
                  rounded={5}
                  placeholder="House No., Building Name *"
                  {...register("houseNo")}
                />
                <FormErrorMessage>
                  {errors.houseNo && errors.houseNo.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt={7} isInvalid={Boolean(errors.streetName)}>
                <Input
                  id="streetName"
                  type="text"
                  rounded={5}
                  placeholder="Street Name, Area *"
                  {...register("streetName")}
                />
                <FormErrorMessage>
                  {errors.streetName && errors.streetName.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt={7} isInvalid={Boolean(errors.landMark)}>
                <Input
                  id="landMark"
                  type="text"
                  rounded={5}
                  placeholder="LandMark *"
                  {...register("landMark")}
                />
                <FormErrorMessage>
                  {errors.landMark && errors.landMark.message}
                </FormErrorMessage>
              </FormControl>

              <Flex alignItems="center" justifyContent="space-between">
                <FormControl mt={7} isInvalid={Boolean(errors.postalCode)}>
                  <Input
                    id="postalCode"
                    type="text"
                    rounded={5}
                    placeholder="Postal Code *"
                    {...register("postalCode")}
                  />
                  <FormErrorMessage>
                    {errors.postalCode && errors.postalCode.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl mt={7} isInvalid={Boolean(errors.city)}>
                  <Input
                    id="city"
                    type="text"
                    rounded={5}
                    placeholder="City / District *"
                    {...register("city")}
                  />
                  <FormErrorMessage>
                    {errors.city && errors.city.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>

              <Flex alignItems="center" justifyContent="space-between">
                <FormControl mt={7} isInvalid={Boolean(errors.country)}>
                  <Input
                    id="country"
                    type="text"
                    rounded={5}
                    disabled
                    defaultValue="India"
                    placeholder="Country *"
                    {...register("country")}
                  />
                  <FormErrorMessage>
                    {errors.country && errors.country.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl mt={7} isInvalid={Boolean(errors.state)}>
                  <Input
                    id="state"
                    type="text"
                    rounded={5}
                    placeholder="State *"
                    {...register("state")}
                  />
                  <FormErrorMessage>
                    {errors.state && errors.state.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>

              <FormControl mt={7} isInvalid={Boolean(errors.phoneNumber)}>
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
              <Button variant="outline" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                type="submit"
                colorScheme="messenger"
                // onClick={}
              >
                Save
              </Button>
            </form>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AddAddress;
