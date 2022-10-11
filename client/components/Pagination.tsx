import React, { useEffect, useState } from "react";

import { Button, Flex } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
const Pagination = ({ data, action }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    if (data) {
      setPageCount(data.pageCount);
    }
  }, [data, setPageCount]);

  useEffect(() => {
    dispatch(action(page));
  }, [action, dispatch, page]);

  function handlePrevious() {
    setPage((p) => {
      if (p === 1) return p;
      return p - 1;
    });
  }

  function handleNext() {
    setPage((p) => {
      if (p === pageCount) return p;
      return p + 1;
    });
  }

  return (
    <Flex alignItems="center" justifyContent="flex-end" gap={1} mt={23}>
      <Button
        variant="outline"
        colorScheme="messenger"
        disabled={page === 1}
        rounded={2}
        onClick={handlePrevious}
      >
        Previous
      </Button>
      {Array(pageCount)
        .fill(null)
        .map((_, index) => {
          return (
            <Button
              variant={page === index + 1 ? "solid" : "outline"}
              rounded={2}
              colorScheme="messenger"
              onClick={() => setPage(index + 1)}
              key={index}
            >
              {index + 1}
            </Button>
          );
        })}
      <Button
        variant="outline"
        colorScheme="messenger"
        rounded={2}
        disabled={page === pageCount}
        onClick={handleNext}
      >
        Next
      </Button>
    </Flex>
  );
};

export default Pagination;
