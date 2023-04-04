import React from "react";
import { SimpleGrid, Box, Text, Heading } from "@chakra-ui/react";
import NextImage from "next/image";
import NextLink from "next/link";
import { motion } from "framer-motion";

// Animation
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,

    transition: {
      staggerChildren: 0.1,
      ease: "easeIn",
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -100 },
  show: { opacity: 1, x: 0 },
};

interface IProductCategory {
  id: number;
  name: string;
  imageUrl: string;
  urlPrefix: string;
}

const productCategories: IProductCategory[] = [
  {
    id: 1,
    name: "Chino Jogger",
    imageUrl: "/static/images/Chino.webp",
    urlPrefix: "Chino Jogger",
  },
  {
    id: 2,
    name: "Twill Jogger",
    imageUrl: "/static/images/Twill.webp",
    urlPrefix: "Twill Jogger",
  },
  {
    id: 3,
    name: "Shirred Jogger",
    imageUrl: "/static/images/Shirred.webp",
    urlPrefix: "Shirred Jogger",
  },
  {
    id: 4,
    name: "Wool Jogger",
    imageUrl: "/static/images/Wool.webp",
    urlPrefix: "Wool Jogger",
  },
  {
    id: 5,
    name: "Motoknit Jogger",
    imageUrl: "/static/images/Motoknit.webp",
    urlPrefix: "Motoknit Jogger",
  },
  {
    id: 6,
    name: "Hiphop Jogger",
    imageUrl: "/static/images/Hiphop.jpg",
    urlPrefix: "Hiphop Jogger",
  },
  {
    id: 7,
    name: "Dropcrotch Jogger",
    imageUrl: "/static/images/Drop.webp",
    urlPrefix: "Dropcrotch Jogger",
  },
  {
    id: 8,
    name: "Distressed Jogger",
    imageUrl: "/static/images/Distressed.jpg",
    urlPrefix: "Distressed Jogger",
  },
];

const Categories = () => {
  return (
    <Box>
      <Heading
        fontSize={["xl", "xl", "4xl"]}
        as="h2"
        mb={10}
        textTransform="uppercase"
        color="blackAlpha.800"
      >
        Categories
      </Heading>
      <SimpleGrid
        columns={[1, 2, 4]}
        spacing={10}
        as={motion.div}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {productCategories.map((category) => (
          <NextLink
            key={category.id}
            href="/products/category"
            as={`/products/category?q=${category.urlPrefix}`}
          >
            <Box cursor="pointer" as={motion.div} variants={item}>
              <Box height={[250, 250, 400]} bg="white" overflow="hidden">
                <Box
                  pos="relative"
                  h="100%"
                  w="100%"
                  as={motion.div}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <NextImage
                    src={category.imageUrl}
                    layout="fill"
                    alt={category.name}
                    objectFit="cover"
                    draggable={false}
                    objectPosition="30% 30%"
                  />
                </Box>
              </Box>
              <Text
                mt={3}
                fontSize="lg"
                fontWeight="semibold"
                textAlign="center"
              >
                {category.name}
              </Text>
            </Box>
          </NextLink>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Categories;
