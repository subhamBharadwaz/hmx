import * as z from 'zod';

export const createOrderSchema = z.object({
	body: z.object({
		shippingInfo: z.object({
			firstName: z.string({required_error: 'First Name is required'}),
			lastName: z.string({required_error: 'Last name is required'}),
			houseNo: z.string({required_error: 'House No, Building name is required'}),
			streetName: z.string({required_error: 'Street name is required'}),
			landMark: z.string({required_error: 'Landmark is required'}),
			postalCode: z.string({required_error: 'Postal Code  is required'}),
			city: z.string({required_error: 'City / District name is required'}),
			country: z.string({required_error: 'Country name is required'}),
			state: z.string({required_error: 'State name is required'}),
			phoneNumber: z.string({required_error: 'Phone Number is required'})
		}),
		orderItems: z.array(
			z.object({
				name: z.string({required_error: 'Name is required'}),
				size: z.string({required_error: 'Size is required'}),
				quantity: z.number({required_error: 'Quantity is required'}),
				// TODO photo validation
				price: z.number({required_error: 'Price is required'})
			})
		),
		paymentInfo: z.object({id: z.string({required_error: 'user Id is required'})}),
		taxAmount: z.number({required_error: 'Tax amount is required'}),
		orderStatus: z.enum(['Processing', 'Shipped', 'Out for delivery', 'Delivered']),
		shippingAmount: z.number({required_error: 'Tax amount is required'}),
		totalAmount: z.number({required_error: 'Tax amount is required'})
	})
});

export type CreateUserInput = Omit<z.TypeOf<typeof createOrderSchema>, 'body'>;
