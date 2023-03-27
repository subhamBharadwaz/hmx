import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Flex,
  HStack,
  Stack,
  Text,
  Progress,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { AiFillStar } from "react-icons/ai";
import { AppDispatch, RootState } from "../../../store";
import { getProductReviews } from "../../../store/services/review/reviewSlice";
import { IProduct } from "../../../types/product";
import { formatDate } from "../../../utils/utilFunctions";

interface IProductDetails {
  product: IProduct;
}

const StarRating = ({ value }) => {
  const stars = [];

  for (let i = 0; i < value; i++) {
    stars.push(<AiFillStar key={i} />);
  }

  return <Flex>{stars}</Flex>;
};

const Reviews = ({ product }: IProductDetails) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getProductReviews(product?._id));
  }, [dispatch, product]);

  const { loading: reviewLoading, reviews } = useSelector(
    (state: RootState) => state.reviewSlice
  );

  //   count how many ratings in the review array
  const countRatings = reviews?.reduce((count, review) => {
    return count + (review?.hasOwnProperty("rating") ? 1 : 0);
  }, 0);

  //   count how many comments in the review array
  const countReviews = reviews?.reduce((count, review) => {
    return count + (review?.hasOwnProperty("comment") ? 1 : 0);
  }, 0);

  const ratingsValues = [1, 2, 3, 4, 5];

  return (
    <Box minH="100vh">
      <Text fontWeight="bold" fontSize="xl">
        Rating & Reviews
      </Text>
      <Box>
        {reviews && reviews?.length !== 0 ? (
          <Box>
            <HStack>
              <Text fontWeight="semibold" fontSize="4xl">
                {product?.ratings}
              </Text>
              <Text color="blackAlpha.600">
                Based on {countRatings} ratings and {countReviews} reviews{" "}
              </Text>
            </HStack>
            <Stack>
              {ratingsValues?.reverse().map((rating) => {
                const count = reviews?.filter(
                  (review) => review?.rating === rating
                ).length;
                return (
                  <Stack direction="row" align="center" key={rating}>
                    <HStack>
                      <Text fontWeight="bold" fontSize="sm">
                        {rating}
                      </Text>
                      <AiFillStar size={14} />
                    </HStack>

                    <Progress
                      value={count}
                      max={100}
                      colorScheme="green"
                      size="sm"
                      width={["full", "full", "xl"]}
                    />
                    <Text color="blackAlpha.600" fontSize="sm">
                      {count}
                    </Text>
                  </Stack>
                );
              })}
            </Stack>
            {/* Reviews */}
            <Box my={10}>
              <Stack spacing={10}>
                {reviews?.map((review) => (
                  <Stack key={review?._id}>
                    <HStack>
                      <Box>
                        <StarRating value={review?.rating} />
                      </Box>
                      <Badge colorScheme="green" variant="solid">
                        Verified Purchaser
                      </Badge>
                    </HStack>
                    <Text color="blackAlpha.700">{review?.comment}</Text>
                    <HStack>
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="blackAlpha.600"
                      >{`${review?.userInfo?.firstName} ${review?.userInfo?.lastName}`}</Text>
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="blackAlpha.600"
                      >
                        {formatDate(review?.date)}
                      </Text>
                    </HStack>
                    <Divider />
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Box>
        ) : (
          <Text fontSize="lg" color="blackAlpha.600" mt={5}>
            There is no rating & review for this product yet!
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default Reviews;
