import { TypeOf } from "zod";
import { addProductSchema } from "../schema/productSchema";

export enum Gender {
  Men = "Men",
  Women = "Women",
  Unisex = "Unisex",
}

export enum Category {
  Twill = "Twill Jogger",
  Shirred = "Shirred Jogger",
  Moto = "Motoknit Jogger",
  Drop = "Dropcrotch Jogger",
  HipHop = "Hiphop Jogger",
  Shading = "Shadingblock Jogger",
  Chino = "Chino Jogger",
  Handcuffed = "Handcuffed Jogger",
  Loose = "Loosepocket Jogger",
  Splash = "Splashcolor Jogger",
  Wool = "Wool Jogger",
  Tore = "Distressed Jogger",
  NonCuffed = "Noncuffed Jogger",
}

export enum RatingType {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
}

export interface IProduct {
  _id?: string;
  name: string;
  price: string;
  description: string;
  photos: {
    id: string;
    secure_url: string;
  }[];
  gender: Gender;
  category: Category;
  brand: string;
  stock: number;
  size: string[];
  ratings: RatingType;
  numberOfReviews: number;
  reviews: {
    user: string;
    name: string;
    rating: number;
    comment: string;
  }[];
  user: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProductInput = TypeOf<typeof addProductSchema>;
