import { object, string, any } from "zod";
const passwordRegex =
  /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const registerUserSchema = object({
  firstName: string().nonempty({ message: "First Name is required" }),

  lastName: string().nonempty({ message: "Last name is required" }),

  email: string()
    .email("Not a valid email")
    .nonempty({ message: "Email is required" }),

  password: string()
    .nonempty({ message: "Password is required" })
    .regex(
      passwordRegex,
      "Password must contain one uppercase and one lowercase letter, number, special character and minimum 8 characters long"
    ),
  confirmPassword: string().nonempty({
    message: "Password confirmation is required",
  }),
  phoneNumber: string()
    .nonempty({ message: "Phone number is required" })
    .min(10)
    .max(10),
  photo: any(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginUserSchema = object({
  email: string()
    .email("Not a valid email")
    .nonempty({ message: "Email is required" }),

  password: string().nonempty({ message: "Password is required" }),
});

export const updateUserSchema = object({
  firstName: string().nonempty({ message: "First Name is required" }),

  lastName: string().nonempty({ message: "Last name is required" }),
  phoneNumber: string()
    .nonempty({ message: "Phone number is required" })
    .min(10)
    .max(10),
  photo: any(),
});

// Change password Schema
export const changePasswordSchema = object({
  currentPassword: string().nonempty({
    message: "Current Password is required",
  }),
  newPassword: string()
    .nonempty({
      message: "New Password is required",
    })
    .regex(
      passwordRegex,
      "Password is required\n, The password length must be greater than or equal to 8,\n The password must contain one or more uppercase characters,\n The password must contain one or more lowercase characters,\n The password must contain one or more numeric values,\n The password must contain one or more special characters\n"
    ),
  confirmNewPassword: string().nonempty({
    message: "Confirm New Password is required",
  }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});
