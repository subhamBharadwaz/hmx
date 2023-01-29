import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "../../types/product";
import {
  Box,
  Text,
  Flex,
  Stack,
  chakra,
  shouldForwardProp,
  Divider,
  Skeleton,
} from "@chakra-ui/react";

import { motion, isValidMotionProp } from "framer-motion";
import Carousel from "./Carousel";

const Home = () => {
  const { loading, products } = useSelector(
    (state: RootState) => state.productSlice
  );

  return (
    <>
      {loading ? (
        <Stack>
          <Skeleton height="50px" /> <Skeleton height="50px" />{" "}
          <Skeleton height="50px" />
        </Stack>
      ) : (
        <Carousel products={products} />
      )}
    </>
  );
};
export default Home;
