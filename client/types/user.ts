import { TypeOf } from "zod";
import {
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
  changePasswordSchema,
} from "../schema/userSchema";
import { adminUpdateUserSchema } from "../schema/adminSchema";

export enum ROLE {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photo: {
    id: string;
    secure_url: string;
  };
  phoneNumber: string;
  role?: ROLE;
  forgotPasswordToken?: string;
  forgotPasswordExpiry?: number;
  createdAt?: Date;
  updatedAt?: Date;
  token?: string;
}

export type UpdateUser = Omit<
  IUser,
  "firstName" | "lastName" | "email" | "password" | "photo" | "phoneNumber"
>;
export type CreateRegisterUserInput = TypeOf<typeof registerUserSchema>;
export type CreateAdminUpdateUserInput = TypeOf<typeof adminUpdateUserSchema>;
export type CreateUpdateUserInput = TypeOf<typeof updateUserSchema>;
export type CreateLoginUserInput = TypeOf<typeof loginUserSchema>;
export type CreateChangePasswordInput = TypeOf<typeof changePasswordSchema>;
