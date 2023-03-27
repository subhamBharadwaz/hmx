import * as z from 'zod';
import {RatingType} from './product.types';

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const addProductSchema = z.object({
	body: z.object({
		name: z
			.string({required_error: 'Product name is required'})
			.max(120, {message: 'Product name should not be more than 120 characters long'}),
		price: z
			.string({required_error: 'Product price is required'})
			.max(6, 'Product price should not be more than 6 digits'),

		description: z
			.string({required_error: 'Product description is required'})
			.max(1000, {message: 'Do not exceed 1000 characters'}),
		gender: z.enum(['Men', 'Women', 'Unisex']),
		category: z.enum([
			'Twill Jogger',
			'Shirred Jogger',
			'Motoknit Jogger',
			'Dropcrotch Jogger',
			'Hiphop Jogger',
			'Shadingblock Jogger',
			'Chino Jogger',
			'Handcuffed Jogger',
			'Loosepocket Jogger',
			'Splashcolor Jogger',
			'Wool Jogger',
			'Distressed Jogger',
			'Noncuffed Jogger'
		]),
		stock: z.string(),
		brand: z.string({required_error: 'Product brand is required'}),
		size: z.array(z.string({required_error: 'Size is required'})),
		photos: z.any()
	})
});

export type CreateProductInput = Omit<z.TypeOf<typeof addProductSchema>, 'body'>;

export const addProductReview = z.object({
	body: z.object({
		rating: z.number({required_error: 'Rating is required'}).min(1).max(5),
		comment: z.string().optional(),
		productId: z.string({required_error: 'Product Id is required'})
	})
});

export type CreateProductReviewInput = Omit<z.TypeOf<typeof addProductReview>, 'body'>;
