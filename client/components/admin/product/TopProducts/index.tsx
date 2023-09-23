import { Box, Text, Stack, Flex } from "@chakra-ui/react";
import { FC } from "react";
import { ITopSellingProps } from "../../../../types/product";
import NextImage from "next/image";

interface TopProductsProps {
  products: ITopSellingProps[];
}

const TopProducts: FC<TopProductsProps> = ({ products }) => {
  return (
    <Box bg="white" boxShadow="sm" p={5} h="md" rounded="lg" w="full">
      <Text fontWeight="semibold" fontSize="lg" mb={4}>
        Top Products
      </Text>

      <Stack>
        {products
          ?.slice(0, 5)
          .sort((a, b) => b.totalRevenue - a.totalRevenue)
          .map((product) => (
            <Flex
              key={product?.productId}
              border="1px"
              borderColor="blackAlpha.200"
              rounded="lg"
              justifyContent="space-between"
              p={2}
            >
              <Flex>
                <NextImage
                  src={product?.photos[0]?.secure_url}
                  alt={product?.name}
                  height={5}
                  width={40}
                />
                <Stack ml={2}>
                  <Text fontSize="sm">{product?.name}</Text>
                  <Text color="blackAlpha.700" fontSize="xs">
                    {product?.category}
                  </Text>
                </Stack>
              </Flex>
              <Box>
                <Text fontSize="sm">{`₹${product?.totalRevenue}`}</Text>
              </Box>
            </Flex>
          ))}
      </Stack>
    </Box>
  );
};

export default TopProducts;
