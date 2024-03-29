/* eslint-disable no-unused-vars */
import {Document} from 'mongoose';
import {Request} from 'express';
import {JwtPayload} from 'jsonwebtoken';

export enum ROLE {
	ADMIN = 'admin',
	USER = 'user'
}

export interface IUser {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	photo: {
		id: string;
		secure_url: string;
	};
	phoneNumber: string;

	role?: ROLE;
	forgotPasswordToken?: string;
	forgotPasswordExpiry?: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
	// eslint-disable-next-line no-unused-vars
	comparePassword: (userPassword: string) => Promise<boolean>;
	getForgotPasswordToken: () => string;
}

export interface IGetUserAuthInfoRequest extends Request {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	user?: any;
}

// Jwt
export interface IJwtPayload extends JwtPayload {
	id: string;
}
