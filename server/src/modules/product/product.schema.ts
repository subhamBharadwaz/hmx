import * as z from 'zod';

export const addProductSchema = z.object({
	body: z.object({
		name: z
			.string({required_error: 'Product name is required'})
			.max(120, {message: 'Product name should not be more than 120 characters long'}),
		price: z
			.string({required_error: 'Product price is required'})
			.max(6, 'Product price should not be more than 6 digits'),
		description: z.string({required_error: 'Product description is required'}),
		category: z.enum(['men', 'women', 'unisex']),
		productType: z.enum([
			'twilljogger',
			'shirredlegjogger',
			'motoknitjogger',
			'dropcrotchjogger',
			'hiphopjogger',
			'shadingblockjogger',
			'chinojogger',
			'handcuffedjogger',
			'loosepocketjogger',
			'splashcolorjogger',
			'wooljogger',
			'distressedjogger',
			'noncuffedjogger'
		]),
		brand: z.string({required_error: 'Product brand is required'}),
		size: z.enum(['s', 'm', 'l', 'xl', 'xxl'])
	})
});

export type CreateProductInput = Omit<z.TypeOf<typeof addProductSchema>, 'body'>;

export const addProductReview = z.object({
	body: z.object({
		rating: z.enum(['1', '2', '3', '4', '5']),
		comment: z.string({required_error: 'Product review is required'}),
		productId: z.string({required_error: 'Product Id is required'})
	})
});

export type CreateProductReviewInput = Omit<z.TypeOf<typeof addProductReview>, 'body'>;
