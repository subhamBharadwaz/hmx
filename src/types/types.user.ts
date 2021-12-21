import {Document} from 'mongoose';
import {Request} from 'express';
import {JwtPayload} from 'jsonwebtoken';

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

export interface IGetUserAuthInfoRequest extends Request {
	user?: any;
}

// Jwt
export interface IJwtPayload extends JwtPayload {
	id: string;
}
