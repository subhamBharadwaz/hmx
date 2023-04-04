import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import NextLink from "next/link";

import {
  Box,
  Text,
  Flex,
  Stack,
  chakra,
  shouldForwardProp,
  Heading,
} from "@chakra-ui/react";

import { motion, isValidMotionProp } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const TopSellingProducts = () => {
  const carousel = useRef<HTMLDivElement>(null);
  const [constraint, setConstraint] = useState(0);

  const { loading, topSellingProducts } = useSelector(
    (state: RootState) => state.productSlice
  );

  useEffect(() => {
    const calcConstraint = () => {
      setConstraint(
        carousel?.current?.scrollWidth - carousel?.current?.offsetWidth
      );
    };
    calcConstraint();
    window.addEventListener("resize", calcConstraint);

    return () => window.removeEventListener("resize", calcConstraint);
  }, []);

  return (
    <>
      <Heading
        as="h2"
        mb={10}
        fontSize={["xl", "xl", "4xl"]}
        textTransform="uppercase"
        color="blackAlpha.800"
      >
        Top Selling Products
      </Heading>
      <Box
        as={motion.div}
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <ChakraBox cursor="grab" overflow="hidden">
          <ChakraBox
            ref={carousel}
            drag="x"
            dragConstraints={{ right: 0, left: -constraint }}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
            whileDrag={{ cursor: "grabbing" }}
            key={constraint}
          >
            <Flex>
              {topSellingProducts.map((product, index) => (
                <Box
                  key={product?.productId}
                  p={2}
                  minW="20rem"
                  userSelect="none"
                  _hover={{ cursor: "pointer" }}
                >
                  <NextLink
                    href="/products/[id]"
                    as={`/products/${product?.productId}`}
                  >
                    <Box p={2} minW="20rem" userSelect="none">
                      <Stack>
                        <Image
                          draggable={false}
                          alt={product?.name}
                          src={product?.photos[0].secure_url}
                          height={350}
                          width={200}
                          objectFit="cover"
                        />
                        <Text fontSize="lg" fontWeight="semibold">
                          {product?.name}
                        </Text>
                        <Text fontSize="lg" fontWeight="bold">
                          ₹ {product?.price}
                        </Text>
                      </Stack>
                    </Box>
                  </NextLink>
                </Box>
              ))}
            </Flex>
          </ChakraBox>
        </ChakraBox>
      </Box>
    </>
  );
};

export default TopSellingProducts;
