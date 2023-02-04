import { Box } from "@chakra-ui/react";

import { useSelector } from "react-redux";
import SingleBagItemCard from "../../components/Bag/SingleBagItemCard";
import { RootState } from "../../store";

import { Skeleton, Stack } from "@chakra-ui/react";

export default function Bag() {
  const { loading, bagData } = useSelector(
    (state: RootState) => state.bagSlice
  );

  return (
    <Box my={20}>
      {loading ? (
        <Stack>
          <Skeleton height="40px" />
          <Skeleton height="40px" />
          <Skeleton height="40px" />
        </Stack>
      ) : (
        bagData &&
        bagData?.products.map((product) => (
          <SingleBagItemCard key={product.productId} productData={product} />
        ))
      )}
    </Box>
  );
}
