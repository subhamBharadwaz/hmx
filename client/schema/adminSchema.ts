import z, { object, string, any } from "zod";

const ROLE = ["admin", "user"] as const;

export const adminUpdateUserSchema = object({
  firstName: string().nonempty({ message: "First Name is required" }),

  lastName: string().nonempty({ message: "Last name is required" }),

  email: string()
    .email("Not a valid email")
    .nonempty({ message: "Email is required" }),

  phoneNumber: string()
    .nonempty({ message: "Phone number is required" })
    .min(10)
    .max(10),
  photo: any(),
  role: z.enum(ROLE),
});
