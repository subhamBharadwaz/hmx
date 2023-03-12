import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Box,
  Flex,
  FormControl,
  Input,
  Button,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  HStack,
  Heading,
  Select,
  Text,
  Stack,
  Progress,
  Textarea,
  InputGroup,
  Icon,
  InputLeftElement,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";

import { ChakraStylesConfig, Select as RSelect } from "chakra-react-select";

import { addProductSchema } from "../../../schema/productSchema";
import { CreateProductInput, Gender, Category } from "../../../types/product";
import { AppDispatch, RootState } from "../../../store";
import { createProduct } from "../../../store/services/admin/adminProductSlice";

import NextLink from "next/link";
import { useRouter } from "next/router";
import { FiFile } from "react-icons/fi";

interface IProductSize {
  value: string;
  label: string;
}

// Product size for multi select
const productSizeOptions: IProductSize[] = [
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
];

export default function CreateProduct() {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, createSuccess, error } = useSelector(
    (state: RootState) => state.adminProductSlice
  );

  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const router = useRouter();

  // Custom style for multi select
  const chakraStyles: ChakraStylesConfig = {
    input: (provided, state) => ({
      ...provided,
      h: 16,
      fontSize: 18,
    }),
  };

  // Toast
  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (createSuccess) {
      toast({
        title: "Product created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [createSuccess, toast]);

  // react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<CreateProductInput>({
    resolver: zodResolver(addProductSchema),
    reValidateMode: "onChange",
  });

  async function onSubmit(values: CreateProductInput) {
    const data = new FormData();

    if (values.photos.length < 2) {
      return;
    }
    for (let i = 0; i < values.photos.length; i++) {
      data.append("photos", values.photos[i]);
    }
    data.append("name", values.name);
    data.append("brand", values.brand);
    data.append("price", values.price);
    data.append("category", values.category);
    data.append("description", values.description);
    data.append("gender", values.gender);
    for (const s of values.size) {
      data.append("size", s);
    }

    data.append("stock", String(values.stock));

    dispatch(createProduct(data as CreateProductInput));
  }

  // async function onSubmit(values: CreateProductInput) {
  //   const data = new FormData();
  //   for (let [key, value] of Object.entries(values)) {
  //     if (Array.isArray(value)) {
  //       return value.forEach((v) => data.append(key, v));
  //     }
  //     data.append(key, value);
  //   }

  //   dispatch(createProduct(data));
  // }

  return (
    <>
      <Breadcrumb
        fontWeight="medium"
        fontSize="md"
        my={4}
        color="blackAlpha.600"
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={NextLink} href="/admin">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink as={NextLink} href="/admin/products">
            Products
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Create</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={5} mt={10}>
          <Text as="b" fontSize={20}>
            Product Name
          </Text>

          <FormControl mt={7} isInvalid={Boolean(errors.name)}>
            <Input
              type="text"
              fontSize={18}
              rounded={5}
              h={16}
              {...register("name")}
            />
            <FormHelperText>
              Do not exceed 100 characters when entering the product name
            </FormHelperText>
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>

        <Stack spacing={5} mt={10}>
          <Text as="b" fontSize={20}>
            Price
          </Text>

          <FormControl mt={7} isInvalid={!!errors.price}>
            <Input
              type="text"
              fontSize={18}
              h={16}
              rounded={5}
              {...register("price")}
            />
            <FormErrorMessage>
              {errors.price && errors.price.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>

        <Flex>
          <Stack spacing={5} mt={10} mr={10}>
            <Text as="b" fontSize={20}>
              Category
            </Text>

            <FormControl mt={7} isInvalid={!!errors.category}>
              <Select
                placeholder="Select Jogger category"
                size="md"
                h={16}
                fontSize={18}
                {...register("category")}
              >
                <option value={Category.Chino}>Chino Jogger</option>
                <option value={Category.Drop}>Drop Jogger</option>
                <option value={Category.Handcuffed}>handcuffed Jogger</option>
                <option value={Category.HipHop}>Hiphop Jogger</option>
                <option value={Category.Loose}>Loose Jogger</option>
                <option value={Category.Moto}>Motoknit Jogger</option>
                <option value={Category.NonCuffed}>Noncuffed Jogger</option>
                <option value={Category.Shading}>Shaddingblock Jogger</option>
                <option value={Category.Shirred}>Shirred Jogger</option>
                <option value={Category.Splash}>Splash Jogger</option>
                <option value={Category.Tore}>Tore Jogger</option>
                <option value={Category.Twill}>Twill Jogger</option>
                <option value={Category.Wool}>Wool Jogger</option>
              </Select>
              <FormErrorMessage>
                {errors.category && errors.category.message}
              </FormErrorMessage>
            </FormControl>
          </Stack>

          <Stack spacing={5} mt={10}>
            <Text as="b" fontSize={20}>
              Gender
            </Text>

            <FormControl mt={7} isInvalid={!!errors.gender}>
              <Select
                placeholder="Select Gender"
                size="md"
                h={16}
                fontSize={18}
                {...register("gender")}
              >
                <option value={Gender.Men}>Men</option>
                <option value={Gender.Women}>Women</option>
                <option value={Gender.Unisex}>Unisex</option>
              </Select>
              <FormErrorMessage>
                {errors.gender && errors.gender.message}
              </FormErrorMessage>
            </FormControl>
          </Stack>
        </Flex>

        <Stack spacing={5} mt={10}>
          <Text as="b" fontSize={20}>
            Brand
          </Text>

          <FormControl mt={7} isInvalid={!!errors.brand}>
            <Input
              type="text"
              fontSize={18}
              rounded={5}
              h={16}
              {...register("brand")}
            />
            <FormHelperText>
              Do not exceed 100 characters when entering the brand name
            </FormHelperText>
            <FormErrorMessage>
              {errors.brand && errors.brand.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>

        <Stack spacing={5} mt={10}>
          <Text as="b" fontSize={20}>
            Available Stock
          </Text>

          <FormControl mt={7} isInvalid={!!errors.stock}>
            <NumberInput defaultValue={0} min={0}>
              <NumberInputField
                type="string"
                fontSize={18}
                rounded={5}
                h={16}
                {...register("stock", {
                  valueAsNumber: true,
                })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>
              {errors.stock && errors.stock.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>
        <Stack spacing={5} mt={10}>
          <Text as="b" fontSize={20}>
            Product Size
          </Text>
          <FormControl mt={7} isInvalid={!!errors.size} id="size">
            <Controller
              control={control}
              name="size"
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <RSelect
                  instanceId="admin-product-size-select"
                  isClearable
                  isMulti
                  placeholder="Select Size"
                  size="lg"
                  chakraStyles={chakraStyles}
                  options={productSizeOptions}
                  ref={ref}
                  value={productSizeOptions.find(
                    (size) => size.value === String(value)
                  )}
                  onChange={(val: IProductSize[]) =>
                    onChange(val.map((size) => size.value))
                  }
                  onBlur={onBlur}
                  closeMenuOnSelect={false}
                  name={name}
                />
              )}
            />
            <FormErrorMessage>
              {errors.size && errors.size.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>
        <Stack spacing={5} mt={10}>
          <Text as="b" fontSize={20}>
            Product Description
          </Text>

          <FormControl mt={7} isInvalid={Boolean(errors.description)}>
            <Textarea
              h={44}
              size="lg"
              {...register("description")}
              placeholder="Write a description about the product"
              resize="none"
            />
            <FormHelperText>
              Do not exceed 500 characters when entering the product description
            </FormHelperText>
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>

        <Stack spacing={5} mt={10}>
          <FormControl mt={7} isInvalid={!!errors.photos}>
            <HStack>
              <Text as="b" fontSize={20} mr={10}>
                Product Images
              </Text>
              {/* //TODO */}

              <Input
                accept="image/*"
                id="file-upload"
                className="visually-hidden"
                colorScheme="linkedin"
                type="file"
                multiple
                {...register("photos")}
                w="auto"
              />
            </HStack>
            <FormErrorMessage>
              {errors.photos && (errors.photos as any).message}
            </FormErrorMessage>
          </FormControl>
        </Stack>

        <Button rounded={5} colorScheme="blue" w="full" mt={7} type="submit">
          Add Product
        </Button>
        {loading && (
          <>
            <Progress mt={5} size="xs" isIndeterminate />
          </>
        )}
      </form>
    </>
  );
}
