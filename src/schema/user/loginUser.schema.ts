import {object, string, TypeOf} from 'zod';

const loginUserSchema = object({
	body: object({
		email: string({
			required_error: 'Email is required'
		}).email('Not a valid email'),

		password: string({required_error: 'Password is required'})
	})
});

export type CreateUserInput = Omit<TypeOf<typeof loginUserSchema>, 'body'>;

export default loginUserSchema;
