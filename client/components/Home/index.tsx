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
} from "@chakra-ui/react";

import { motion, isValidMotionProp } from "framer-motion";
import Carousel from "./Carousel";

const Home = () => {
  const { loading, products } = useSelector(
    (state: RootState) => state.userProductSlice
  );

  return <>{loading ? <h1>Loading</h1> : <Carousel products={products} />}</>;
};
export default Home;
