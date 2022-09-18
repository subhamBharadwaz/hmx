import {IUser} from './user.types';
// import {BigPromise} from '../../middlewares';
import User from './user.model';
import {logger} from '../../utils';

export async function registerUser(input: IUser) {
	try {
		return User.create(input);
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
	}
}

export async function findUser(email: string, select?: string) {
	try {
		return User.findOne({email}).select(select);
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
	}
}

export async function resetPassword(token: string) {
	try {
		return User.findOne({token, forgotPasswordExpiry: {$gt: Date.now()}}); // only want to find the user whose forgotPasswordExpiry is in the future
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
	}
}

export async function findUserById(id: string, select?: string) {
	try {
		return User.findById(id).select(select);
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
	}
}

export async function updateUser(id: string, data: IUser, select?: string) {
	try {
		return User.findByIdAndUpdate(id, data, {
			new: true,
			runValidators: true,
			useFindAndModify: false
		}).select(select);
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
	}
}

// Admin services
export async function findAllUsers(select?: string) {
	try {
		return User.find().select(select);
	} catch (error: any) {
		logger.error(error);
		throw new Error(error);
	}
}
