import * as z from 'zod';

const addProductSchema = z.object({
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

export type CreateUserInput = Omit<z.TypeOf<typeof addProductSchema>, 'body'>;

export default addProductSchema;
