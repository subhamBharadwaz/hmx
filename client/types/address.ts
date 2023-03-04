import { TypeOf } from "zod";
import { createAddressSchema } from "../schema/addressSchema";
import { createBagSchema } from "../schema/bagSchema";

export interface IAddress {
  firstName: string;
  lastName: string;
  houseNo: string;
  streetName: string;
  landMark: string;
  postalCode: string;
  city: string;
  country: string;
  state: string;
  phoneNumber: string;
}

export type CreateAddressInput = TypeOf<typeof createAddressSchema>;
