import {object, string, TypeOf} from 'zod';

const passwordRegex = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

const passwordResetSchema = object({
	body: object({
		password: string({required_error: 'Password is required'}).regex(
			passwordRegex,
			'Password is required\n, The password length must be greater than or equal to 8,\n The password must contain one or more uppercase characters,\n The password must contain one or more lowercase characters,\n The password must contain one or more numeric values,\n The password must contain one or more special characters\n'
		),
		confirmPassword: string({
			required_error: 'passwordConfirmation is required'
		})
	}).refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	})
});

export type CreateUserInput = Omit<TypeOf<typeof passwordResetSchema>, 'body.passwordConfirm'>;

export default passwordResetSchema;
