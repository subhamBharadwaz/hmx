import { useRef, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useRadioGroup,
  HStack,
  Flex,
  Divider,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Image from "next/image";
import { GrClose } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { deleteWishlistItem } from "../../store/services/wishlist/wishlistSlice";
import { BsBag } from "react-icons/bs";
import SizeRadioCard from "../Product/SingleProduct/SizeRadioCard";
import { createAndUpdateBagItems } from "../../store/services/bag/bagSlice";
import NextImage from "next/image";
import { RxCross1 } from "react-icons/rx";

interface IProductData {
  product: {
    productId: string;
    name: string;
    price: number;
    photos: {
      id: string;
      secure_url: string;
    }[];
    size: string[];
    category: string;
  };
}

const allSizes = ["S", "M", "L", "XL", "XXL"];

const WishlistItem = ({ product }: IProductData) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [isSizeEmpty, setIsSizeEmpty] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (value) => {
    setSelectedSize(value);
    setIsSizeEmpty(false);
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "size",
    defaultValue: "",
    onChange: handleChange,
  });

  const group = getRootProps();

  const handleAddToBag = (productId, size) => {
    dispatch(createAndUpdateBagItems({ productId, size, quantity: 1 }));
    dispatch(deleteWishlistItem({ productId }));
  };

  return (
    <Box maxW={300} pos="relative">
      <span
        className="wishlist-close"
        onClick={() =>
          dispatch(deleteWishlistItem({ productId: product.productId }))
        }
      >
        <GrClose />
      </span>
      <NextLink href={`/product/${product.productId}`}>
        <Box
          w="100%"
          pos="relative"
          paddingTop="125%"
          background="rgb(246,249,246)"
          cursor="pointer"
        >
          <Image
            src={product.photos[0].secure_url}
            alt={product.name}
            layout="fill"
            className="wishlist-image"
          />
        </Box>
      </NextLink>
      <Stack spacing={3} mt={3}>
        <Box>
          <Text fontSize="xl" color="gray.600">
            {product?.name}
          </Text>
        </Box>
        <Box>
          <Text as="b">{`₹ ${product?.price}`}</Text>
        </Box>
        <Box>
          <Button
            variant="outline"
            w="100%"
            colorScheme="gray"
            color="gray.600"
            leftIcon={<BsBag />}
            onClick={onOpen}
          >
            MOVE TO BAG
          </Button>
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogBody p={5}>
                  <Stack>
                    <Flex justifyContent="space-between">
                      <Stack direction="row">
                        <NextImage
                          src={product?.photos[0].secure_url}
                          alt={product.name}
                          height={100}
                          width={75}
                          objectFit="cover"
                        />
                        <Stack>
                          <Text fontSize="md" fontWeight="bold">
                            {product?.name}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {product?.category}
                          </Text>
                          <Text fontSize="lg" fontWeight="bold">
                            {`₹ ${product?.price}`}
                          </Text>
                        </Stack>
                      </Stack>
                      <Box
                        fontSize="xl"
                        cursor="pointer"
                        ref={cancelRef}
                        onClick={onClose}
                      >
                        <RxCross1 />
                      </Box>
                    </Flex>
                    <Divider />
                    <Text fontSize="md" fontWeight="bold">
                      Please select a size.
                    </Text>
                    <HStack {...group}>
                      {allSizes.map((value) => {
                        const radio = getRadioProps({ value });
                        return (
                          <Box
                            key={value}
                            className={
                              product?.size?.some((s) => s === value)
                                ? ""
                                : "outstock"
                            }
                          >
                            <SizeRadioCard {...radio}>{value}</SizeRadioCard>
                          </Box>
                        );
                      })}
                    </HStack>
                  </Stack>
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    colorScheme={isSizeEmpty ? "gray" : "messenger"}
                    cursor={isSizeEmpty ? "not-allowed" : "pointer"}
                    w="100%"
                    onClick={() =>
                      onClose && isSizeEmpty
                        ? console.log("select a size")
                        : handleAddToBag(product.productId, selectedSize)
                    }
                  >
                    ADD TO BAG
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Box>
      </Stack>
    </Box>
  );
};

export default WishlistItem;
