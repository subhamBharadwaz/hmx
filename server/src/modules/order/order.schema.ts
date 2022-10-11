import * as z from 'zod';

export const createOrderSchema = z.object({
	body: z.object({
		shippingInfo: z.object({
			address: z.string({required_error: 'Address is required'}),
			city: z.string({required_error: 'City name is required'}),
			phoneNo: z.number({required_error: 'Phone number is required'}),
			postalCode: z.string({required_error: 'Postal Code is required'}),
			state: z.string({required_error: 'State is required'}),
			country: z.string({required_error: 'Country name is required'})
		}),
		orderItems: z.object({
			name: z.string({required_error: 'Name is required'}),
			quantity: z.number({required_error: 'Quantity is required'}),
			// TODO photo validation
			price: z.number({required_error: 'Price is required'})
		})
	})
});

export type CreateUserInput = Omit<z.TypeOf<typeof createOrderSchema>, 'body'>;
