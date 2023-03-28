import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  IconButton,
  Textarea,
  Stack,
  useToast,
  Flex,
  Badge,
  Divider,
} from "@chakra-ui/react";

import { AiFillStar } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import NextImage from "next/image";

import { AppDispatch, RootState } from "../../store";
import {
  createProductReview,
  getProductReviews,
} from "../../store/services/review/reviewSlice";
import { getAllOrders } from "../../store/services/order/orderSlice";
import withAuth from "../../components/HOC/withAuth";

function ReviewPurchases() {
  const dispatch = useDispatch<AppDispatch>();

  const [rating, setRating] = useState({});
  const [comment, setComment] = useState("");
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [showDetails, setShowDetails] = useState({});

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const { orders } = useSelector((state: RootState) => state.orderSlice);
  const { loading } = useSelector((state: RootState) => state.reviewSlice);

  const toast = useToast();

  const handleOrderItemClick = (orderItem) => {
    if (selectedOrderItem === orderItem) {
      setSelectedOrderItem(null);
    } else {
      setSelectedOrderItem(orderItem);
    }
  };

  const handleRatingClick = (orderItem, value) => {
    setRating({ ...rating, [orderItem._id]: value });
    setSelectedOrderItem(orderItem);
    setShowDetails({ ...showDetails, [orderItem._id]: true });
  };

  function handleCommentChange(e) {
    setComment(e.target.value);
  }

  function submitReviewHandler(productId, rating, comment) {
    if (rating) {
      dispatch(createProductReview({ productId, rating, comment }));
    } else {
      const id = "test-toast";
      if (!toast.isActive(id)) {
        toast({
          id,
          title: "Please give a rating.",
          status: "error",
          position: "top-right",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }

  const filteredOrders = orders.filter(
    (order) => order.orderStatus === "Delivered"
  );

  return (
    <Stack spacing={10} alignItems="center" justifyContent="center" my={20}>
      {filteredOrders
        .flatMap((order) => order.orderItems)
        ?.map((orderItem) => {
          return (
            <>
              <Stack key={orderItem?._id} h={200} w={["full", "full", 500]}>
                <Stack direction="row" spacing={5}>
                  <Box h={200} w={150} position="relative">
                    <NextImage
                      src={orderItem?.image}
                      alt={orderItem?.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </Box>
                  <Stack>
                    <Stack>
                      <Text fontSize="lg">{orderItem?.name}</Text>
                      <Badge colorScheme="green" w="50%">
                        Delivered
                      </Badge>
                      <Flex>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <IconButton
                            key={value}
                            aria-label={`${value} star rating`}
                            variant="unstyled"
                            mx={-1}
                            icon={
                              <AiFillStar
                                color={
                                  value <= (rating[orderItem._id] || 0)
                                    ? "orange"
                                    : "gray"
                                }
                                size={25}
                              />
                            }
                            onClick={() => {
                              handleRatingClick(orderItem, value);
                            }}
                          />
                        ))}
                      </Flex>
                    </Stack>
                  </Stack>
                  {selectedOrderItem === orderItem ? null : (
                    <Text
                      onClick={() => handleOrderItemClick(orderItem)}
                      alignSelf="flex-end"
                      cursor="pointer"
                      fontSize="md"
                      fontWeight="semibold"
                      color="blue.600"
                    >
                      Write A Review
                    </Text>
                  )}
                </Stack>
              </Stack>
              {selectedOrderItem === orderItem && (
                <Stack w={["full", "full", 500]} spacing={5}>
                  <Textarea
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Tell us what you liked (or didn't like) about this item."
                  />
                  <Button
                    isLoading={loading ? true : false}
                    loadingText="Submitting"
                    colorScheme="messenger"
                    onClick={() =>
                      submitReviewHandler(
                        orderItem?.product,
                        rating[orderItem?._id],
                        comment
                      )
                    }
                  >
                    Submit
                  </Button>
                </Stack>
              )}
              <Divider w={["full", "full", 500]} />
            </>
          );
        })}
    </Stack>
  );
}

export default withAuth(ReviewPurchases);

/**
 * <Stack key={orderItem?._id}>
            <HStack>
              {[1, 2, 3, 4, 5].map((value) => (
                <IconButton
                  key={value}
                  aria-label={`${value} star rating`}
                  variant="unstyled"
                  icon={
                    <AiFillStar
                      color={value <= rating ? "orange" : "gray"}
                      size={25}
                    />
                  }
                  onClick={() => handleRatingClick(value)}
                />
              ))}
            </HStack>
            <Text>Write a comment</Text>
            <Input value={comment} onChange={handleCommentChange} />
            <Button
              colorScheme="messenger"
              onClick={() =>
                submitReviewHandler(orderItem?.product, rating, comment)
              }
            >
              Submit
            </Button>
            <Button variant="solid" colorScheme="gray" mr={3}>
              Cancel
            </Button>
          </Stack>
 */
