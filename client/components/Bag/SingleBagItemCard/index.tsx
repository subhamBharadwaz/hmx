import { useRef } from "react";
import {
  Box,
  Flex,
  Stack,
  Text,
  Button,
  HStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import NextImage from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { Select as RSelect, ChakraStylesConfig } from "chakra-react-select";
import {
  createAndUpdateBagItems,
  deleteBagItem,
} from "../../../store/services/bag/bagSlice";
import { useEffect } from "react";
import { getSingleProduct } from "../../../store/services/product/productSlice";
import { createWishlist } from "../../../store/services/wishlist/wishlistSlice";
import { motion } from "framer-motion";
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
  variants: any;
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

const SingleBagItemCard = ({ productData, variants }: IProductData) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getSingleProduct(productData.productId));
  }, [dispatch, productData.productId]);

  const handleMoveToWishlist = (productId) => {
    dispatch(createWishlist({ productId }));
    dispatch(deleteBagItem(productId));
  };

  const { loading, product } = useSelector(
    (state: RootState) => state.productSlice
  );

  const chakraStyles: ChakraStylesConfig = {
    input: (provided, state) => ({
      ...provided,
      px: [0, 0, 3],
    }),
  };

  return (
    <Box
      mx="auto"
      border="1px"
      borderColor="gray.300"
      p={5}
      my={4}
      as={motion.div}
      variants={variants}
    >
      <Box>
        <Flex justifyContent="space-between">
          <Box>
            <Text fontSize={["lg", "lg", "xl"]}>{productData?.name}</Text>
            <Text
              fontSize={["lg", "lg", "xl"]}
              as="b"
            >{`₹ ${productData?.price}`}</Text>
            <Stack direction="row" spacing={5} mt={5}>
              <HStack>
                <Text fontWeight="bold" fontSize="md">
                  Size:
                </Text>
                <RSelect
                  size="sm"
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
              <HStack pos="relative">
                <Text fontWeight="bold" fontSize="md">
                  Quantity:
                </Text>
                <RSelect
                  size="sm"
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
            <NextImage
              src={productData?.photos[0]?.secure_url}
              alt={productData.name}
              height={166}
              width={120}
              objectFit="cover"
            />
          </Box>
        </Flex>
      </Box>
      <Box mt={[5, 5, 0]}>
        <HStack align="center" spacing={10}>
          <Button
            variant="outline"
            fontSize="sm"
            fontWeight="semibold"
            size={["sm", "sm", "lg"]}
            onClick={() => dispatch(deleteBagItem(productData.productId))}
          >
            REMOVE
          </Button>
          <Button
            variant="outline"
            fontSize="sm"
            fontWeight="semibold"
            size={["sm", "sm", "lg"]}
            onClick={onOpen}
          >
            MOVE TO WISHLIST
          </Button>
        </HStack>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <Flex p={10}>
                <NextImage
                  src={productData?.photos[0]?.secure_url}
                  alt={productData.name}
                  height={45}
                  width={100}
                  objectFit="cover"
                />
                <Box>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Move Item To Wishlist
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure you want to remove the product from the cart
                    and add to wishlist?
                  </AlertDialogBody>
                </Box>
              </Flex>

              <AlertDialogFooter gap={5}>
                <Button ref={cancelRef} onClick={onClose} w="50%">
                  NO
                </Button>
                <Button
                  colorScheme="messenger"
                  onClick={() => {
                    handleMoveToWishlist(productData.productId);
                    onClose;
                  }}
                  w="50%"
                >
                  YES
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Box>
  );
};

export default SingleBagItemCard;
