import { useCallback, useEffect, useState } from "react";
import { IProduct } from "../../../types/product";
import {
  Box,
  Flex,
  HStack,
  Stack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useRadioGroup,
  Button,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { createAndUpdateBagItems } from "../../../store/services/bag/bagSlice";
import NextLink from "next/link";
import NextImage from "next/image";
import SizeRadioCard from "./SizeRadioCard";

import { BsBagCheck, BsSuitHeart, BsFillHeartFill } from "react-icons/bs";
import {
  createWishlist,
  deleteWishlistItem,
  getWishlistItems,
} from "../../../store/services/wishlist/wishlistSlice";
import SizeGuide from "../SizeGuide";

interface Product {
  product: IProduct;
}

const allSizes = ["S", "M", "L", "XL", "XXL"];

const SingleProduct = ({ product }: Product) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [isSizeEmpty, setIsSizeEmpty] = useState(null);
  const [addToBagButtonText, setAddToBagButtonText] = useState("ADD TO BAG");
  const [isAlreadyAddedToWishlist, setIsAlreadyAddedToWishlist] =
    useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { loading } = useSelector((state: RootState) => state.bagSlice);
  const { wishlistData } = useSelector(
    (state: RootState) => state.wishlistSlice
  );

  useEffect(() => {
    dispatch(getWishlistItems());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (wishlistData?.products?.find((p) => p.productId === product._id)) {
        setIsAlreadyAddedToWishlist(true);
      } else {
        setIsAlreadyAddedToWishlist(false);
      }
    }
  }, [isAlreadyAddedToWishlist, loading, product._id, wishlistData?.products]);

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
    setAddToBagButtonText("GO TO BAG");
  };

  return (
    <Flex w="100%" justifyContent="space-between">
      <Box w="45%">
        <Flex align="center" wrap="wrap" gap={5}>
          {product?.photos?.map((photo) => (
            <Box key={photo?.id}>
              <NextImage
                src={photo?.secure_url}
                alt={product?.name}
                width={250}
                height={300}
                objectFit="cover"
              />
            </Box>
          ))}
        </Flex>
      </Box>
      <Stack w="50%" spacing={5}>
        <Stack my={5}>
          <Text fontSize="3xl" as="b">
            {product?.name}
          </Text>
          <Text fontSize="md" fontWeight="medium" color="blackAlpha.500">
            {product?.category}
          </Text>
          <Text
            fontSize="xl"
            as="b"
            letterSpacing={1.1}
          >{`₹${product?.price}`}</Text>
          <Stack gap={3}>
            <HStack spacing={5}>
              <Text as="b" fontSize="md">
                Select Size
              </Text>

              <SizeGuide />
            </HStack>
            <Stack>
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
              {isSizeEmpty && (
                <Box
                  py={2}
                  px={3}
                  bg="red.100"
                  w="50%"
                  border="1px solid transparent"
                  borderColor="red.200"
                  borderRadius="md"
                  color="red.700"
                >
                  Please select size
                </Box>
              )}
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={5}>
          <Button
            isLoading={loading ? true : false}
            loadingText="Adding to Bag"
            spinnerPlacement="start"
            leftIcon={<BsBagCheck />}
            colorScheme="messenger"
            variant="solid"
            onClick={() =>
              isSizeEmpty || selectedSize === null
                ? setIsSizeEmpty(true)
                : handleAddToBag(product._id, selectedSize)
            }
          >
            <NextLink href={addToBagButtonText === "GO TO BAG" ? "/bag" : "#"}>
              {addToBagButtonText}
            </NextLink>
          </Button>
          <Button
            leftIcon={
              isAlreadyAddedToWishlist ? <BsFillHeartFill /> : <BsSuitHeart />
            }
            colorScheme="messenger"
            variant="outline"
            onClick={() =>
              isAlreadyAddedToWishlist
                ? dispatch(deleteWishlistItem({ productId: product._id }))
                : dispatch(createWishlist({ productId: product._id }))
            }
          >
            WISHLIST
          </Button>
        </Stack>
        <Accordion
          defaultIndex={[0]}
          allowMultiple
          border="1px"
          borderColor="blackAlpha.200"
        >
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box
                  as="b"
                  flex="1"
                  fontSize="lg"
                  textAlign="left"
                  color="blackAlpha.700"
                >
                  Product Description
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} color="blackAlpha.700" lineHeight={1.7}>
              {product?.description}
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  Section 2 title
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
    </Flex>
  );
};

export default SingleProduct;
