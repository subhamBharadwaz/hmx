import {Document} from 'mongoose';

export interface IUser {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	photo: {
		id: string;
		secure_url: string;
	};
	role?: string;
	forgotPasswordToken?: string;
	forgotPasswordExpiry?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
	comparePassword: (userPassword: string) => Promise<boolean>;
	getJwtToken: () => string;
	getForgotPasswordToken: () => string;
}
