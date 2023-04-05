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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";

import { ChakraStylesConfig, Select as RSelect } from "chakra-react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { addProductSchema } from "../../../schema/productSchema";
import { CreateProductInput, Gender, Category } from "../../../types/product";
import { AppDispatch, RootState } from "../../../store";
import { createProduct } from "../../../store/services/admin/adminProductSlice";

import NextLink from "next/link";
import { useRouter } from "next/router";
import { FiFile } from "react-icons/fi";
import withAuth from "../../../components/HOC/withAuth";

import { Toast } from "../../../components/Toast";
import ImageUpload from "../../../components/ImageUpload";

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

function CreateProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const [apiError, setApiError] = useState<string | null>(null);

  const [quillDetailValue, setQuillDetailValue] = useState("");
  const [quillDescriptionValue, setQuillDescriptionValue] = useState("");

  const { loading, error } = useSelector(
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
  const { addToast } = Toast();

  useEffect(() => {
    if (error) {
      addToast({
        id: "product-create-toast",
        title: "Unable to create product.",
        description: error,
        status: "error",
      });
    }
  }, [error, addToast]);

  // react-hook-form
  const {
    register,
    setValue,
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
    data.append("detail", quillDetailValue);
    data.append("description", quillDescriptionValue);
    data.append("gender", values.gender);
    for (const s of values.size) {
      data.append("size", s);
    }

    data.append("stock", String(values.stock));

    dispatch(createProduct(data as CreateProductInput))
      .unwrap()
      .then(() => {
        addToast({
          id: "success-toast",
          title: "product created successfully.",
          status: "success",
        });
      })
      .catch((error: { message: string }) => {
        setApiError(error.message);
      });
  }

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
            Product Detail
          </Text>

          <FormControl mt={7} isInvalid={Boolean(errors.description)}>
            <Controller
              name="detail"
              control={control}
              rules={{ required: "Product Detail is required" }}
              defaultValue=""
              render={({ field: { onChange, onBlur, value } }) => (
                <ReactQuill
                  value={value}
                  onBlur={onBlur}
                  onChange={(newValue) => {
                    setQuillDetailValue(newValue);
                    onChange(newValue);
                  }}
                />
              )}
            />
            <FormHelperText>
              Enter the product details using markdown syntax. Do not exceed 500
              characters.
            </FormHelperText>
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>

        <Stack spacing={5} mt={10}>
          <Text as="b" fontSize={20}>
            Product Description
          </Text>

          <FormControl mt={7} isInvalid={Boolean(errors.description)}>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              defaultValue=""
              render={({ field: { onChange, onBlur, value } }) => (
                <ReactQuill
                  value={value}
                  onBlur={onBlur}
                  onChange={(newValue) => {
                    setQuillDescriptionValue(newValue);
                    onChange(newValue);
                  }}
                />
              )}
            />
            <FormHelperText>
              Enter the product description using markdown syntax. Do not exceed
              500 characters.
            </FormHelperText>
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>

        <Stack spacing={5} mt={10}>
          <FormControl mt={7} isInvalid={!!errors.photos}>
            <Stack>
              <Text as="b" fontSize={20} mr={10}>
                Product Images
              </Text>

              <ImageUpload
                {...register("photos")}
                isMultiple={true}
                files={[]}
                onChange={(files: File[]) => {
                  setValue("photos", files);
                }}
              />
            </Stack>
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

export default withAuth(CreateProduct, true);
