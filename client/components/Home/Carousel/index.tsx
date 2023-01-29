import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { IProduct } from "../../../types/product";
import {
  Box,
  Text,
  Flex,
  Stack,
  chakra,
  shouldForwardProp,
  Divider,
} from "@chakra-ui/react";

import { motion, isValidMotionProp } from "framer-motion";

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const Carousel = ({ products }) => {
  const carousel = useRef<HTMLDivElement>(null);
  const [constraint, setConstraint] = useState(0);

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
          {products &&
            products.products.map((product: IProduct) => (
              <NextLink
                key={product._id}
                href="/product/[id]"
                as={`/product/${product._id}`}
              >
                <Box p={2} minW="20rem">
                  <Stack>
                    <Image
                      draggable={false}
                      alt={product.name}
                      src={product.photos[0].secure_url}
                      height={500}
                      width={400}
                      objectFit="cover"
                    />

                    <Text fontWeight="semibold">{product.name}</Text>
                    <Divider bg="gray.400" h=".8px" />
                    <Text color="blackAlpha.600">{product.category}</Text>
                    <Text>{`₹ ${product.price}`}</Text>
                  </Stack>
                </Box>
              </NextLink>
            ))}
        </Flex>
      </ChakraBox>
    </ChakraBox>
  );
};

export default Carousel;
