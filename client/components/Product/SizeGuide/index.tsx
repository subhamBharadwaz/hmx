import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useDisclosure,
  Stack,
  HStack,
  Flex,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

import NextImage from "next/image";

const SizeGuide = () => {
  const [isInch, setIsInch] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Text
        color="green.400"
        fontWeight="bold"
        fontSize="sm"
        cursor="pointer"
        onClick={onOpen}
      >
        Size Guide
      </Text>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader mx="auto" textDecoration="underline">
            SIZE GUIDE
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody maxH={400} overflowY="scroll">
            <Stack>
              <NextImage
                src="/static/images/size-guide.webp"
                width={300}
                height={400}
                objectFit="contain"
              />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  colorScheme={isInch ? "messenger" : "gray"}
                  onClick={() => {
                    setIsInch(true);
                    console.log(isInch);
                  }}
                >
                  In
                </Button>
                <Button
                  colorScheme={isInch ? "gray" : "messenger"}
                  onClick={() => {
                    setIsInch(false);
                    console.log(isInch);
                  }}
                >
                  Cms
                </Button>
              </Stack>
              <Text align="center">
                {isInch
                  ? "To-Fit Denotes Body Measurements in Inches"
                  : "To-Fit Denotes Body Measurements in Cms"}
              </Text>

              {/* Table */}
              <TableContainer>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Size</Th>
                      <Th isNumeric>Fits To (Waist)</Th>
                      <Th isNumeric>Fits to (Hips)</Th>
                      <Th isNumeric>Fits to (Outseam Length)</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>S</Td>
                      <Td isNumeric>{isInch ? "28" : "71"}</Td>
                      <Td isNumeric>{isInch ? "37" : "94"}</Td>
                      <Td isNumeric>{isInch ? "36.25" : "92.1"}</Td>
                    </Tr>
                    <Tr>
                      <Td>M</Td>
                      <Td isNumeric>{isInch ? "30" : "76.2"}</Td>
                      <Td isNumeric>{isInch ? "39.0" : "99.1"}</Td>
                      <Td isNumeric>{isInch ? "37.25" : "94.6"}</Td>
                    </Tr>
                    <Tr>
                      <Td>L</Td>
                      <Td isNumeric>{isInch ? "32" : "81.3"}</Td>
                      <Td isNumeric>{isInch ? "41.0" : "104.1"}</Td>
                      <Td isNumeric>{isInch ? "38.0" : "97.2"}</Td>
                    </Tr>
                    <Tr>
                      <Td>XL</Td>
                      <Td isNumeric>{isInch ? "34" : "86.4"}</Td>
                      <Td isNumeric>{isInch ? "43.0" : "109.2"}</Td>
                      <Td isNumeric>{isInch ? "39.25" : "99.7"}</Td>
                    </Tr>
                    <Tr>
                      <Td>XXL</Td>
                      <Td isNumeric>{isInch ? "36" : "91.4"}</Td>
                      <Td isNumeric>{isInch ? "45.0" : "114.3"}</Td>
                      <Td isNumeric>{isInch ? "40.25" : "102.2"}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SizeGuide;
