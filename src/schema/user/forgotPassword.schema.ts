import {object, string, TypeOf} from 'zod';

const forgotPasswordSchema = object({
	body: object({
		email: string({
			required_error: 'Email is required'
		}).email('Not a valid email')
	})
});

export type CreateUserInput = Omit<TypeOf<typeof forgotPasswordSchema>, 'body'>;

export default forgotPasswordSchema;
