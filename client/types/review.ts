import { TypeOf } from "zod";
import { addProductReview } from "../schema/reviewSchema";

export enum RatingType {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
}

export interface IProductReview {
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
  };
  rating: number;
  comment: string;
  date: Date;
  _id: string;
}

export type CreateReviewInput = TypeOf<typeof addProductReview>;
