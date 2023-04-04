import { TypeOf } from "zod";
import { createBagSchema } from "../schema/bagSchema";

export interface IBag {
  _id: string;
  user: string;
  products: {
    productId: string;
    quantity: number;
    name: string;
    size: string;
    price: number;
    photos: {
      id: string;
      secure_url: string;
    }[];
  }[];

  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBagInput = TypeOf<typeof createBagSchema>;
