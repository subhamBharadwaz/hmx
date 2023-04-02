import React from "react";
import {
  Box,
  Stack,
  Text,
  List,
  ListItem,
  Flex,
  Center,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
} from "@chakra-ui/react";
import {
  AiFillInstagram,
  AiFillLinkedin,
  AiFillGithub,
  AiFillTwitterCircle,
} from "react-icons/ai";

import NextLink from "next/link";
import NextImage from "next/image";

interface IProductCategory {
  id: number;
  name: string;
  urlPrefix: string;
}

const productCategories: IProductCategory[] = [
  {
    id: 1,
    name: "Chino Jogger",
    urlPrefix: "Chino Jogger",
  },
  {
    id: 2,
    name: "Twill Jogger",
    urlPrefix: "Twill Jogger",
  },
  {
    id: 3,
    name: "Shirred Jogger",
    urlPrefix: "Shirred Jogger",
  },
  {
    id: 4,
    name: "Wool Jogger",
    urlPrefix: "Wool Jogger",
  },
  {
    id: 5,
    name: "Motoknit Jogger",
    urlPrefix: "Motoknit Jogger",
  },
  {
    id: 6,
    name: "Hiphop Jogger",
    urlPrefix: "Hiphop Jogger",
  },
  {
    id: 7,
    name: "Dropcrotch Jogger",
    urlPrefix: "Dropcrotch Jogger",
  },
  {
    id: 8,
    name: "Distressed Jogger",
    urlPrefix: "Distressed Jogger",
  },
];

const Footer = () => {
  return (
    <Box w="full" minH="30vh" bg="gray.100" mt={100} pt={50} pb={100}>
      <Box w={["95%", "95%", "60%"]} mx="auto">
        <Text fontWeight="bold" fontSize="3xl" mb={10}>
          HMX
        </Text>
        <Flex
          wrap="wrap"
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Text mb={3} fontSize="xl" fontWeight="bold" color="messenger.500">
              NEED HELP
            </Text>
            <List spacing={2} fontWeight="semibold" color="">
              <ListItem>
                <NextLink href="#">Contact Us</NextLink>
              </ListItem>
              <ListItem>
                <NextLink href="#">My Account</NextLink>
              </ListItem>
              <ListItem>
                <NextLink href="#">Track Order</NextLink>
              </ListItem>
              <ListItem>
                <NextLink href="#">FAQs</NextLink>
              </ListItem>
            </List>
          </Box>
          <Box>
            <Text mb={3} fontSize="xl" fontWeight="bold" color="messenger.500">
              COMPANY
            </Text>
            <List spacing={2} fontWeight="semibold" color="">
              <ListItem>
                <NextLink href="#">About Us</NextLink>
              </ListItem>
              <ListItem>
                <NextLink href="#">Careers</NextLink>
              </ListItem>
              <ListItem>
                <NextLink href="#">Terms & Conditions</NextLink>
              </ListItem>
              <ListItem>
                <NextLink href="#">Privacy Policy</NextLink>
              </ListItem>
            </List>
          </Box>
          <Box>
            <Text mb={3} fontSize="xl" fontWeight="bold" color="messenger.500">
              MORE INFO
            </Text>
            <List spacing={2} fontWeight="semibold" color="">
              <ListItem>
                <NextLink href="#">T&C</NextLink>
              </ListItem>
              <ListItem>
                <NextLink href="#">Sitemap</NextLink>
              </ListItem>
              <ListItem>
                <NextLink href="#">Blog</NextLink>
              </ListItem>
            </List>
          </Box>
        </Flex>

        <Center my={20}>
          <HStack>
            <Text fontSize="md" color="blackAlpha.700">
              Follow us:
            </Text>
            <HStack>
              <NextLink href="https://github.com/subhamBharadwaz">
                <AiFillGithub size={30} />
              </NextLink>
              <NextLink href="#">
                <AiFillLinkedin size={30} />
              </NextLink>
              <NextLink href="#">
                <AiFillTwitterCircle size={30} />
              </NextLink>
              <NextLink href="#">
                <AiFillInstagram size={30} />
              </NextLink>
            </HStack>
          </HStack>
        </Center>

        <Accordion border="1px" borderColor="blackAlpha.200" allowMultiple>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                  NAVIGATION LINKS
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text color="messenger.600" mb={2}>
                Categories
              </Text>

              {productCategories.map((category) => (
                <NextLink
                  key={category.id}
                  href="/products/category"
                  as={`/products/category?q=${category.urlPrefix}`}
                >
                  <Text
                    display="inline-block"
                    fontSize="sm"
                    color="blackAlpha.700"
                    mr={2}
                    cursor="pointer"
                  >
                    {category.name} |
                  </Text>
                </NextLink>
              ))}
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                  WHO WE ARE
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Stack spacing={3}>
                <Text color="blackAlpha.800" lineHeight={7}>
                  Welcome to HMX, the ultimate joggers web app designed to help
                  you achieve your fitness goals and track your progress along
                  the way.
                </Text>
                <Text color="blackAlpha.800" lineHeight={7}>
                  Our team at HMX is dedicated to creating a community of
                  runners and fitness enthusiasts who are passionate about
                  living a healthy lifestyle. We believe that running is more
                  than just a form of exercise, it&apos;s a way to challenge
                  yourself, push your limits, and achieve personal growth.
                </Text>

                <Text color="blackAlpha.800" lineHeight={7}>
                  Whether you&apos;re a seasoned runner or just starting out,
                  HMX has everything you need to make your fitness journey a
                  success. With personalized workout plans, detailed tracking
                  and analysis tools, and a supportive community of like-minded
                  individuals, you&apos;ll have all the resources you need to
                  stay motivated and reach your goals.
                </Text>
                <Text color="blackAlpha.800" lineHeight={7}>
                  At HMX, we&apos;re committed to providing you with the best
                  possible user experience. Our easy-to-use app is designed to
                  be intuitive and user-friendly, so you can focus on what
                  really matters - your workout. We also take your privacy
                  seriously, which is why we&apos;ve implemented
                  state-of-the-art security measures to protect your data.
                </Text>
                <Text color="blackAlpha.800" lineHeight={7}>
                  So why wait? Sign up for HMX today and start your journey to a
                  healthier, more active lifestyle!
                </Text>
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Stack
          alignItems={[null, null, "center"]}
          mt={20}
          spacing={[-4, -4, 10]}
          maxW="60%"
          direction={["column", "column", "row"]}
        >
          <Text color="blackAlpha.700">100% Secure Payment:</Text>
          <Stack direction="row" spacing={5}>
            <Box h={125} w={70} pos="relative">
              <NextImage
                src="/static/svgs/razorpay.svg"
                layout="fill"
                alt="razorpay"
              />
            </Box>

            <Box h={125} w={70} pos="relative">
              <NextImage
                src="/static/svgs/googlePay.svg"
                layout="fill"
                alt="google pay"
              />
            </Box>
            <Box h={125} w={70} pos="relative">
              <NextImage
                src="/static/svgs/amazonPay.svg"
                layout="fill"
                alt="amazon pay"
              />
            </Box>
            <Box h={125} w={70} pos="relative">
              <NextImage src="/static/svgs/visa.svg" layout="fill" alt="visa" />
            </Box>
          </Stack>
        </Stack>
        <Divider
          h={0.7}
          orientation="horizontal"
          backgroundColor="blackAlpha.300"
        />
      </Box>
    </Box>
  );
};

export default Footer;
