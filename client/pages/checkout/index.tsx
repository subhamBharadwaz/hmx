import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  useDisclosure,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Stack,
} from "@chakra-ui/react";
import Script from "next/script";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlinePlusCircle } from "react-icons/ai";
import axios from "axios";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { IOrder, OrderStatusType } from "../../types/order";
import { RootState, AppDispatch } from "../../store";
import { emptyBag } from "../../store/services/bag/bagSlice";
import { createOrder } from "../../store/services/order/orderSlice";
import { getRazorpayKey } from "../../store/services/checkout/checkoutSlice";
import BillingDetails from "../../components/DeliveryAddress/BillingDetails";
import AddAddressForm from "../../components/DeliveryAddress/AddAddressForm";
import AddressCard from "../../components/DeliveryAddress/AddressCard";
import { Toast } from "../../components/Toast";

export default function DeliveryAddress() {
  const dispatch = useDispatch<AppDispatch>();
  const [apiError, setApiError] = useState<string | null>(null);

  const { bagData } = useSelector((state: RootState) => state.bagSlice);
  const { shippingAddress } = useSelector(
    (state: RootState) => state.addressSlice
  );

  const { razorpayKey, error } = useSelector(
    (state: RootState) => state.checkoutSlice
  );

  const { addToast } = Toast();

  useEffect(() => {
    if (error) {
      addToast({
        id: "razorpay-toast",
        title: "Unable to update password.",
        description: error,
        status: "error",
      });
    }
  }, [error, addToast]);

  // Getting razorpay key
  useEffect(() => {
    dispatch(getRazorpayKey())
      .unwrap()
      .then(() => {})
      .catch((error: { message: string }) => {
        setApiError(error.message);
      });
  }, [dispatch]);

  // Order info
  const items = bagData?.products?.map((product) => {
    return {
      name: product?.name,
      size: product?.size,
      quantity: product?.quantity,
      image: product?.photos[0]?.secure_url,
      price: product?.price,
      product: product?.productId,
    };
  });

  const orderDetails: IOrder = {
    shippingInfo: {
      firstName: shippingAddress?.firstName,
      lastName: shippingAddress?.lastName,
      houseNo: shippingAddress?.houseNo,
      streetName: shippingAddress?.streetName,
      landMark: shippingAddress?.landMark,
      postalCode: shippingAddress?.postalCode,
      city: shippingAddress?.city,
      country: shippingAddress?.country,
      state: shippingAddress?.state,
      phoneNumber: shippingAddress?.phoneNumber,
    },
    orderItems: items,

    paymentInfo: {
      id: "testId",
    },
    taxAmount: 0,
    shippingAmount: 0,
    totalAmount: bagData?.totalPrice,
  };

  // Making the payment
  const makePayment = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/capturerazorpaypayment`,
        { amount: bagData?.totalPrice },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const convertResponse = await res.data;

      const { order } = convertResponse;
      const options = {
        key: razorpayKey,
        amount: bagData?.totalPrice,
        currency: "INR",
        name: "HMX",
        order_id: order?.id.toString(),
        callback_url: `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/payment/verification`,
        handler: function (response) {
          axios
            .post(
              `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/v1/payment/verification`,
              response
            )
            .then((res) => {
              dispatch(createOrder(orderDetails));
              dispatch(emptyBag(bagData?._id));
              router.push(`/checkout/success`);
            })
            .catch((error) => {
              addToast({
                id: "payment-failed",
                title: "Payment Failed!",
                description:
                  "Please try again. Contact us if the issue remains.",
                status: "error",
              });
              console.error(error);
            });
        },

        theme: {
          color: "#3399cc",
        },
      };
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      addToast({
        id: "payment-failed-2",
        title: "Payment Failed!",
        description: "Please try again. Contact us if the issue remains.",
        status: "error",
      });
      console.error(error);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Breadcrumb
        fontWeight="medium"
        fontSize="md"
        mb={10}
        color="blackAlpha.600"
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={NextLink} href="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>
            {" "}
            <BreadcrumbLink as={NextLink} href="/bag">
              Bag
            </BreadcrumbLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Checkout</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box>
        <Stack
          justifyContent="space-between"
          direction={["column", "column", "row"]}
          spacing={5}
        >
          <Box minW="50%">
            <Text fontSize="lg" fontWeight="bold" mb={5}>
              Delivered To
            </Text>
            {shippingAddress !== null ? (
              <AddressCard shippingAddress={shippingAddress} onOpen={onOpen} />
            ) : (
              <Box p={20} minH={245} border="1px" borderColor="gray.200">
                <Flex
                  align="center"
                  justifyContent="center"
                  flexDir="column"
                  cursor="pointer"
                  onClick={onOpen}
                >
                  <AiOutlinePlusCircle size={40} color="#ccc" />
                  <Text>Add New Address</Text>
                </Flex>
              </Box>
            )}
            <AddAddressForm isOpen={isOpen} onClose={onClose} />
          </Box>
          <Box minW="40%">
            <BillingDetails
              shippingAddress={shippingAddress}
              makePayment={makePayment}
              totalPrice={bagData?.totalPrice}
            />
          </Box>
        </Stack>
      </Box>
    </>
  );
}
