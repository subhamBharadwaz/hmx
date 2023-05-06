/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import { Box, Text, Stack } from "@chakra-ui/react";
import Image from "next/image";

interface CardProps {
  title: string;
  value: string | number;
  imgSrc: string;
}

const Card: FC<CardProps> = ({ title, value, imgSrc }) => {
  return (
    <Stack
      minW={["full", "full", 250]}
      px={5}
      py={2}
      boxShadow="sm"
      bg="white"
      rounded="lg"
    >
      <Text color="blackAlpha.800">{title}</Text>
      <Text fontSize="xl" fontWeight="semibold">
        {value}
      </Text>
      <Box pos="relative" w="full" h={20}>
        <Image src={imgSrc} layout="fill" objectFit="cover" alt="wave" />
      </Box>
    </Stack>
  );
};

export default Card;
