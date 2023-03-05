import React from "react";
import { Button } from "@chakra-ui/react";
import NextLink from "next/link";

export default function MyAccount() {
  return (
    <>
      <NextLink href="/my-account/orders">
        <Button>Orders</Button>
      </NextLink>
      <NextLink href="/my-account/profile">
        <Button ml={10}>Profile</Button>
      </NextLink>
    </>
  );
}
