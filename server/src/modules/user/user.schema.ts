import {object, string, TypeOf} from 'zod';

const passwordRegex = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

// Register User schema
export const registerUserSchema = object({
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

export type CreateRegisterUserInput = TypeOf<typeof registerUserSchema>['body'];

// Login user schema
export const loginUserSchema = object({
	body: object({
		email: string({
			required_error: 'Email is required'
		}).email('Not a valid email'),

		password: string({required_error: 'Password is required'})
	})
});

export type CreateLoginUserInput = TypeOf<typeof loginUserSchema>['body'];

// Update user schema
export const updateUserSchema = object({
	body: object({
		firstName: string({required_error: 'First name is required'}).min(1, 'Must be filled'),

		lastName: string({required_error: 'Last Name is required'}).min(1, 'Must be filled')
	})
});

export type CreateUpdateUserInput = TypeOf<typeof updateUserSchema>['body'];

// Change password Schema
export const changePasswordSchema = object({
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

export type CreateChangePasswordInput = Omit<
	TypeOf<typeof changePasswordSchema>,
	'body.confirmNewPassword'
>;

// Forgot password schema
export const forgotPasswordSchema = object({
	body: object({
		email: string({
			required_error: 'Email is required'
		}).email('Not a valid email')
	})
});

export type CreateForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];

// Password reset schema
export const passwordResetSchema = object({
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

export type CreatePasswordResetInput = Omit<
	TypeOf<typeof passwordResetSchema>,
	'body.passwordConfirm'
>;
