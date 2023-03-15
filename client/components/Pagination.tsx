import React, { useEffect, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";

/**
 *
 * @param data
 * @param action
 *  * It takes in two props: data (an object with information about the list of items, such as the total number of pages) and action (a function that is called when the user clicks on a pagination button).
 *
 *  * The component renders a series of pagination buttons using the map function and the displayPages array.
 * * The buttons are either page numbers (rendered as Button components) or ellipses (rendered as a Text component). The "Previous" and "Next" buttons are also rendered using Button components, and are disabled if the user is on the first or last page, respectively
 */
const Pagination = ({ data, action }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [displayPages, setDisplayPages] = useState([]);

  useEffect(() => {
    if (data) {
      setPageCount(data.pageCount);
    }
  }, [data, setPageCount]);

  useEffect(() => {
    dispatch(action(page));
  }, [action, dispatch, page]);

  /**
   * * useEffect to update displayPages whenever page or pageCount changes. The logic in this hook determines which page numbers should be displayed based on the current page number and the total number of pages, and updates the displayPages state variable accordingly
   */
  useEffect(() => {
    if (pageCount > 0) {
      const display = [];
      if (pageCount <= 5) {
        for (let i = 1; i <= pageCount; i++) {
          display.push(i);
        }
      } else {
        if (page < 5) {
          for (let i = 1; i <= 5; i++) {
            display.push(i);
          }
          display.push("...");
          display.push(pageCount - 1);
          display.push(pageCount);
        } else if (page >= pageCount - 3) {
          display.push(1);
          display.push(2);
          display.push("...");
          for (let i = pageCount - 4; i <= pageCount; i++) {
            display.push(i);
          }
        } else {
          display.push(1);
          display.push("...");
          for (let i = page - 1; i <= page + 1; i++) {
            display.push(i);
          }
          display.push("...");
          display.push(pageCount - 1);
          display.push(pageCount);
        }
      }
      setDisplayPages(display);
    }
  }, [page, pageCount, setDisplayPages]);

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
      {displayPages.map((p, i) => {
        return (
          <React.Fragment key={i}>
            {p === "..." ? (
              <Text>...</Text>
            ) : (
              <Button
                variant={page === p ? "solid" : "outline"}
                rounded={2}
                colorScheme="messenger"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            )}
          </React.Fragment>
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
