import {object, string, TypeOf} from 'zod';

const passwordRegex = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

const changePasswordSchema = object({
	body: object({
		currentPassword: string({required_error: 'Current Password is required'}),
		newPassword: string({
			required_error: 'New Password is required'
		}).regex(
			passwordRegex,
			'Password is required\n, The password length must be greater than or equal to 8,\n The password must contain one or more uppercase characters,\n The password must contain one or more lowercase characters,\n The password must contain one or more numeric values,\n The password must contain one or more special characters\n'
		),
		confirmNewPassword: string({required_error: 'Confirm New Password is required'})
	}).refine(data => data.newPassword === data.confirmNewPassword, {
		message: 'Passwords do not match',
		path: ['confirmNewPassword']
	})
});

export type CreateUserInput = Omit<TypeOf<typeof changePasswordSchema>, 'body.confirmNewPassword'>;

export default changePasswordSchema;
