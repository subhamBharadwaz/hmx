import { object, string, TypeOf } from "zod";

export const createAddressSchema = object({
  firstName: string().nonempty({ message: "First name is required" }),

  lastName: string().nonempty({ message: "Last name is required" }),

  houseNo: string().nonempty({
    message: "House No, Building name is required",
  }),

  streetName: string().nonempty({ message: "Street name is required" }),
  landMark: string().nonempty({ message: "Landmark is required" }),
  postalCode: string().nonempty({ message: "Postal Code is required" }),
  city: string().nonempty({ message: "City / District name is required" }),
  country: string().nonempty({ message: "Country name is required" }),
  state: string().nonempty({ message: "State name is required" }),
  phoneNumber: string().nonempty({ message: "Phone Number  is required" }),
});
