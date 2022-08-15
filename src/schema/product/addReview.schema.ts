import * as z from 'zod';

const addProductReview = z.object({
	body: z.object({
		rating: z.enum(['1', '2', '3', '4', '5']),
		comment: z.string({required_error: 'Product review is required'}),
		productId: z.string({required_error: 'Product Id is required'})
	})
});

export type CreateUserInput = Omit<z.TypeOf<typeof addProductReview>, 'body'>;

export default addProductReview;
