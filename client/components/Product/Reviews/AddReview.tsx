import { useState } from "react";
import {
  Box,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  IconButton,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";

import { AiFillStar } from "react-icons/ai";
import { BsChevronRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { createProductReview } from "../../../store/services/review/reviewSlice";

interface OrderItems {
  orderItems: {
    name: string;
    size: string;
    quantity: number;
    image: string;
    price: string;
    product: string;
    _id: string;
  }[];
}

const AddReview = ({ orderItems }: OrderItems) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.reviewSlice);

  function handleRatingClick(value) {
    if (rating === value) {
      setRating(0);
    } else {
      setRating(value);
    }
  }

  function handleCommentChange(e) {
    setComment(e.target.value);
  }

  function submitReviewHandler(productId, rating, comment) {
    if (rating) {
      dispatch(createProductReview({ productId, rating, comment }));

      onClose();
    } else {
      const id = "test-toast";
      if (!toast.isActive(id)) {
        toast({
          id,
          title: "Please give a rating.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }

  return (
    <>
      <Box w="sm" h={100} bg="blackAlpha.200" cursor="pointer" onClick={onOpen}>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack>
            <Text fontSize="lg" color="messenger.700">
              Write a Product review{" "}
            </Text>
            <HStack>
              <AiFillStar color="orange" />
              <AiFillStar color="orange" />
              <AiFillStar color="orange" />
              <AiFillStar color="orange" />
            </HStack>
          </HStack>
          <BsChevronRight />
        </HStack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Write a Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {orderItems?.map((item) => (
              <Stack key={item?._id}>
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
                    submitReviewHandler(item?.product, rating, comment)
                  }
                >
                  Submit
                </Button>
                <Button
                  variant="solid"
                  colorScheme="gray"
                  mr={3}
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </Stack>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddReview;
