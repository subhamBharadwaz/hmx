import {object, string, TypeOf, any} from 'zod';

export const createUserSchema = object({
	body: object({
		firstName: string({
			required_error: 'First name is required'
		}),
		lastName: string({
			required_error: 'Last name is required'
		}),
		password: string({
			required_error:
				'Password is required and Password must be minimum 8 characters long and contains at least 1 uppercase, 1 lowercase, 1 number and 1 symbol'
		}),
		photo: any({
			required_error: 'Photo is required'
		}),

		email: string({
			required_error: 'Email is required'
		}).email('Not a valid email')
	})
});

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, 'body'>;
