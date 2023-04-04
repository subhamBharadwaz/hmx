import * as z from "zod";

export const addProductReview = z.object({
  rating: z.number({ required_error: "Rating is required" }).min(1).max(5),
  comment: z.string().optional(),
  productId: z.string({ required_error: "Product Id is required" }),
});
