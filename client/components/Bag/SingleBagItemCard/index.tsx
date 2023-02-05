import { Box, Flex, Stack, Text, Button, HStack } from "@chakra-ui/react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { Select as RSelect, ChakraStylesConfig } from "chakra-react-select";
import {
  createAndUpdateBagItems,
  deleteBagItem,
} from "../../../store/services/bag/bagSlice";
import { useEffect } from "react";
import { getSingleProduct } from "../../../store/services/product/productSlice";

interface IProductData {
  productData: {
    productId: string;
    quantity: number;
    name: string;
    size: string;
    price: number;
    photos: {
      id: string;
      secure_url: string;
    }[];
  };
}

interface IProductSize {
  value: string;
  label: string;
}

interface IProductQuantity {
  value: number;
  label: number;
}

const productSizeOptions: IProductSize[] = [
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
];

const productQuantityOptions: IProductQuantity[] = [
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
  { value: 6, label: 6 },
  { value: 7, label: 7 },
  { value: 8, label: 8 },
  { value: 9, label: 9 },
  { value: 10, label: 10 },
];

const SingleBagItemCard = ({ productData }: IProductData) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getSingleProduct(productData.productId));
  }, [dispatch, productData.productId]);

  const { loading, product } = useSelector(
    (state: RootState) => state.productSlice
  );

  const chakraStyles: ChakraStylesConfig = {
    input: (provided, state) => ({
      ...provided,
      px: 3,
    }),
  };

  return (
    <Box mx="auto" w="60%" border="1px" borderColor="gray.300" p={5} my={4}>
      <Box>
        <Flex justifyContent="space-between">
          <Box>
            <Text fontSize="xl">{productData?.name}</Text>
            <Text fontSize="xl" as="b">{`₹ ${productData?.price}`}</Text>
            <Stack direction="row" spacing={5} mt={5}>
              <HStack>
                <Text fontWeight="bold" fontSize="md">
                  Size:
                </Text>
                <RSelect
                  chakraStyles={chakraStyles}
                  name="size"
                  placeholder="Size:"
                  options={
                    loading
                      ? productSizeOptions
                      : product?.size &&
                        product?.size.map((s) => ({ value: s, label: s }))
                  }
                  defaultValue={{
                    label: productData?.size,
                    value: productData?.size,
                  }}
                  onChange={(e: { value: string }) => {
                    dispatch(
                      createAndUpdateBagItems({
                        productId: productData.productId,
                        size: e.value,
                        quantity: productData.quantity,
                      })
                    );
                  }}
                />
              </HStack>
              <HStack>
                <Text fontWeight="bold" fontSize="md">
                  Quantity:
                </Text>
                <RSelect
                  chakraStyles={chakraStyles}
                  name="quantity"
                  placeholder="Quantity:"
                  options={productQuantityOptions}
                  defaultValue={{
                    label: productData?.quantity,
                    value: productData?.quantity,
                  }}
                  onChange={(e: { value: number }) => {
                    dispatch(
                      createAndUpdateBagItems({
                        productId: productData.productId,
                        size: productData.size,
                        quantity: e.value,
                      })
                    );
                  }}
                />
              </HStack>
            </Stack>
          </Box>
          <Box borderRadius="20px" overflow="hidden">
            <Image
              src={productData?.photos[0]?.secure_url}
              alt={productData.name}
              height={166}
              width={120}
              objectFit="cover"
            />
          </Box>
        </Flex>
      </Box>
      <Box>
        <HStack align="center" spacing={10}>
          <Button
            variant="outline"
            fontSize="sm"
            fontWeight="bold"
            size="lg"
            onClick={() => dispatch(deleteBagItem(productData.productId))}
          >
            REMOVE
          </Button>
          <Button variant="outline" fontSize="sm" fontWeight="bold" size="lg">
            MOVE TO WISHLIST
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default SingleBagItemCard;
