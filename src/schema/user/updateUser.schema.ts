import {object, string, TypeOf} from 'zod';

const updateUserSchema = object({
	body: object({
		firstName: string({required_error: 'First name is required'}).min(1, 'Must be filled'),

		lastName: string({required_error: 'Last Name is required'}).min(1, 'Must be filled'),

		email: string({required_error: 'Email is required'})
			.email('Not a valid email')
			.min(1, 'Must be filled')
	})
});

export type CreateUserInput = Omit<TypeOf<typeof updateUserSchema>, 'body'>;

export default updateUserSchema;
