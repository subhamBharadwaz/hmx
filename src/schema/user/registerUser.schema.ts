import {object, string, TypeOf} from 'zod';

const passwordRegex = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

const registerUserSchema = object({
	body: object({
		firstName: string({
			required_error: 'First name is required'
		}),

		lastName: string({
			required_error: 'Last name is required'
		}),

		email: string({
			required_error: 'Email is required'
		}).email('Not a valid email'),

		password: string({required_error: 'Password is required'}).regex(
			passwordRegex,
			'Password is required\n, The password length must be greater than or equal to 8,\n The password must contain one or more uppercase characters,\n The password must contain one or more lowercase characters,\n The password must contain one or more numeric values,\n The password must contain one or more special characters\n'
		)

		// TODO photo validation
		// photo: {
		// 	_type: z.any(),

		// }
	})
});

export type CreateUserInput = Omit<TypeOf<typeof registerUserSchema>, 'body'>;

export default registerUserSchema;
