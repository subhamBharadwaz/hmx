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
  Divider,
} from "@chakra-ui/react";

import { motion, isValidMotionProp } from "framer-motion";

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

interface FeaturedProduct {
  name: string;
  imageUrl: string;
  urlPrefix: string;
}

const featuredProducts: FeaturedProduct[] = [
  {
    name: "Chino Jogger",
    imageUrl: "/static/images/Chino.webp",
    urlPrefix: "Chino Jogger",
  },
  {
    name: "Twill Jogger",
    imageUrl: "/static/images/Twill.webp",
    urlPrefix: "Twill Jogger",
  },
  {
    name: "Shirred Jogger",
    imageUrl: "/static/images/Shirred.webp",
    urlPrefix: "Shirred Jogger",
  },
  {
    name: "Wool Jogger",
    imageUrl: "/static/images/Wool.webp",
    urlPrefix: "Wool Jogger",
  },
  {
    name: "Motoknit Jogger",
    imageUrl: "/static/images/Motoknit.webp",
    urlPrefix: "Motoknit Jogger",
  },
  {
    name: "Hiphop Jogger",
    imageUrl: "/static/images/Hiphop.jpg",
    urlPrefix: "Hiphop Jogger",
  },
  {
    name: "Dropcrotch Jogger",
    imageUrl: "/static/images/Drop.webp",
    urlPrefix: "Dropcrotch Jogger",
  },
  {
    name: "Distressed Jogger",
    imageUrl: "/static/images/Distressed.jpg",
    urlPrefix: "Distressed Jogger",
  },
];

const FeaturedProduct = () => {
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
          {featuredProducts.map((product: FeaturedProduct) => (
            <NextLink
              key={product.name}
              href="#"
              // as={`/product/${product._id}`}
            >
              <Box p={2} minW="20rem">
                <Stack>
                  <Image
                    draggable={false}
                    alt={product.name}
                    src={product.imageUrl}
                    height={500}
                    width={400}
                    objectFit="cover"
                  />

                  {/* <Text fontWeight="semibold">{product.name}</Text>
                    <Divider bg="gray.400" h=".8px" />
                    <Text color="blackAlpha.600">{product.category}</Text>
                    <Text>{`₹ ${product.price}`}</Text> */}
                </Stack>
              </Box>
            </NextLink>
          ))}
        </Flex>
      </ChakraBox>
    </ChakraBox>
  );
};

export default FeaturedProduct;
