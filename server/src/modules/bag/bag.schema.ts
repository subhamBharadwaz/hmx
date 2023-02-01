import * as z from 'zod';

export const createBagSchema = z.object({
	body: z.object({
		productId: z.string({required_error: 'Product id is required'}),

		quantity: z.number({required_error: 'Product quantity is required'}).default(1)
	})
});

export type CreateBagInput = Omit<z.TypeOf<typeof createBagSchema>, 'body'>;
