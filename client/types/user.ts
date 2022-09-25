import { TypeOf } from "zod";
import { registerUserSchema, loginUserSchema } from "../schema/userSchema";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photo: {
    id: string;
    secure_url: string;
  };
  phoneNumber: string;
  role?: string;
  forgotPasswordToken?: string;
  forgotPasswordExpiry?: number;
  createdAt?: Date;
  updatedAt?: Date;
  token?: string;
}

export type CreateRegisterUserInput = TypeOf<typeof registerUserSchema>;
export type CreateLoginUserInput = TypeOf<typeof loginUserSchema>;
